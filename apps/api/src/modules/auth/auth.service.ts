import { Inject, Injectable, Logger } from '@nestjs/common';

import { AppException } from '../../common/errors/app.exception.js';
import { ERROR_CODES } from '../../common/errors/error-codes.js';
import type { ApiEnv } from '../../config/env.js';
import { API_ENV } from '../../config/env.token.js';
import { hashPassword, verifyPassword } from '../../infra/crypto/password.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { runAsTenant } from '../../infra/prisma/tenant-context.js';
import { BreachedPasswordService } from './breached-password.service.js';
import type { GoogleIdentity } from './google-oauth.service.js';
import { GoogleOAuthService } from './google-oauth.service.js';
import { MfaService } from './mfa.service.js';
import { checkPasswordPolicy } from './password-policy.js';
import { MFA_CHALLENGE_TTL_SECONDS, TokenService, type IssuedTokens } from './token.service.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  platformRole: string | null;
  mustChangePassword: boolean;
  emailVerifiedAt: Date | null;
  locale: string;
  activeBusinessId: string | undefined;
}

export interface LoginResult {
  tokens: IssuedTokens;
  user: AuthenticatedUser;
}

/**
 * What a correct password produces.
 *
 * Two outcomes rather than one, because a password is not always enough: an account with a second factor
 * gets a short-lived challenge and no tokens at all. Modelling it as a single result with a nullable
 * token would let a caller that forgot to check hand out an unauthenticated session, and the type makes
 * that impossible to write by accident.
 */
export type LoginOutcome =
  | { kind: 'session'; tokens: IssuedTokens; user: AuthenticatedUser }
  | { kind: 'mfa_required'; challengeToken: string; expiresInSeconds: number };

/**
 * The user fields a sign-in path needs.
 *
 * Structural rather than a Prisma payload type, so the same shape can be produced by a `select` on
 * `User` and handed to `openSession` without either side importing the other's generated types.
 */
interface SignInUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  platformRole: string | null;
  mustChangePassword: boolean;
  emailVerifiedAt: Date | null;
  locale: string;
  deletedAt: Date | null;
}

/**
 * Whether an error is Prisma's unique-constraint violation.
 *
 * Checked on `code` rather than with `instanceof`, so it does not depend on which module instance the
 * generated client came from — the distinction that makes `instanceof` unreliable across a generated
 * client and its runtime.
 */
function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { code?: unknown }).code === 'P2002';
}

const GOOGLE_SCOPE = 'openid email profile';

/**
 * How long a verification link stays usable.
 *
 * A day, not an hour: the link arrives in an inbox somebody may not open until the evening, and a policy
 * that expires before it can be used teaches people to ignore verification mails. It is single-use, so
 * the window is the only thing at risk, and the address was unverified until then anyway.
 */
const VERIFY_EMAIL_TTL_SECONDS = 24 * 60 * 60;

/**
 * The user fields a session needs, plus the ones that decide whether one may be opened at all.
 *
 * One constant rather than the same ten-line `select` written out on every sign-in path, which is how a
 * field ends up missing from the path somebody added last — and the failure is a `403` that makes no
 * sense rather than a compile error.
 */
const SIGN_IN_USER_FIELDS = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  status: true,
  platformRole: true,
  mustChangePassword: true,
  emailVerifiedAt: true,
  locale: true,
  deletedAt: true,
} as const;

/**
 * A hash of a throwaway password, verified against when the e-mail matches no account.
 *
 * Without it, a login attempt for an unknown address returns in microseconds while a known one takes
 * the tens of milliseconds Argon2id is designed to take — and that difference is a free account
 * enumeration oracle. Verifying against this constant costs the same work as a real check and can never
 * succeed. Computed once at module load, because hashing it per request would add the very cost being
 * spent.
 */
const DUMMY_HASH_PROMISE = hashPassword('a-password-that-is-never-valid-4f3c2b1a');

/**
 * Signing in, signing out, and who the caller is.
 *
 * ── Every failure returns the same 401 ───────────────────────────────────────
 * Unknown e-mail, wrong password, suspended account and soft-deleted account are indistinguishable to
 * the caller. The one exception is lockout, which IS reported: an attacker already knows they are being
 * throttled, while a legitimate user who is not told would keep trying and conclude the product is
 * broken. That is a deliberate trade, not an oversight.
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(API_ENV) private readonly env: ApiEnv,
    private readonly prisma: PrismaService,
    private readonly tokens: TokenService,
    private readonly mfa: MfaService,
    private readonly google: GoogleOAuthService,
    private readonly breached: BreachedPasswordService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async login(input: {
    email: string;
    password: string;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
  }): Promise<LoginOutcome> {
    const client = this.prisma.getClient();

    // Normalised here because the column is documented as always lower-cased, and that is what makes
    // its unique index genuinely case-insensitive.
    const email = input.email.trim().toLowerCase();

    const user = await client.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        platformRole: true,
        mustChangePassword: true,
        emailVerifiedAt: true,
        locale: true,
        passwordHash: true,
        failedLoginAttempts: true,
        lockedUntil: true,
        deletedAt: true,
      },
    });

    if (user === null) {
      // Spend the same time a real check would, then fail identically.
      await verifyPassword(await DUMMY_HASH_PROMISE, input.password);

      throw AppException.unauthenticated('Identifiants invalides.');
    }

    if (user.lockedUntil !== null && user.lockedUntil.getTime() > Date.now()) {
      throw new AppException(
        429,
        'RATE_LIMITED',
        'Compte temporairement verrouillé après plusieurs tentatives. Réessayez plus tard.',
        { lockedUntil: user.lockedUntil.toISOString() },
      );
    }

    const passwordMatches = await this.checkPassword(user.passwordHash, input.password);

    if (!passwordMatches) {
      await this.recordFailedAttempt(user.id, user.failedLoginAttempts);

      throw AppException.unauthenticated('Identifiants invalides.');
    }

    // Checked AFTER the password, so a suspended account cannot be discovered by anyone who does not
    // already hold its credentials.
    if (user.deletedAt !== null || user.status !== 'ACTIVE') {
      throw AppException.unauthenticated('Identifiants invalides.');
    }

    // The password is correct, so the attempt counters are cleared HERE rather than at the end: a user
    // who passes the password step and then fails their second factor must not creep towards a lockout
    // for a password they demonstrably know.
    await client.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });

    // ── The second factor ──────────────────────────────────────────────────────
    // No session and no tokens: the caller gets a short-lived challenge and nothing else. This is the
    // DoD made concrete — an account with MFA enabled cannot obtain a token from the password alone.
    if (await this.mfa.isEnabled(user.id)) {
      return {
        kind: 'mfa_required',
        challengeToken: await this.tokens.signMfaChallenge(user.id),
        expiresInSeconds: MFA_CHALLENGE_TTL_SECONDS,
      };
    }

    return { kind: 'session', ...(await this.openSession(user, input)) };
  }

  /**
   * Second step of a login that owes a second factor.
   *
   * The user is loaded again rather than trusted from the challenge token: five minutes is long enough
   * for an account to be suspended or deleted in between, and the challenge was issued before that.
   */
  async verifyMfa(input: {
    challengeToken: string;
    code: string;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
  }): Promise<LoginOutcome> {
    const userId = await this.tokens.verifyMfaChallenge(input.challengeToken);

    if (!(await this.mfa.verifyForUser(userId, input.code))) {
      throw AppException.unauthenticated('Code de vérification invalide.');
    }

    const user = await this.prisma.getClient().user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        platformRole: true,
        mustChangePassword: true,
        emailVerifiedAt: true,
        locale: true,
        deletedAt: true,
      },
    });

    // Same 401 as a wrong password: whether the account was suspended between the two steps is not
    // something an attacker holding a challenge token needs to learn.
    if (user === null || user.deletedAt !== null || user.status !== 'ACTIVE') {
      throw AppException.unauthenticated('Identifiants invalides.');
    }

    return { kind: 'session', ...(await this.openSession(user, input)) };
  }

  /**
   * The consent URL for a Google sign-in, with a state the browser will be held to.
   *
   * The caller stores the state in a cookie; the callback compares it. See `google-state.ts` for what
   * that defends against.
   */
  googleAuthorizationUrl(state: string): string {
    return this.google.authorizationUrl(state);
  }

  /** Exchanges a Google authorization code for the identity behind it. */
  exchangeGoogleCode(code: string): Promise<GoogleIdentity> {
    return this.google.exchangeCode(code);
  }

  /**
   * Signs in the person behind a verified Google identity.
   *
   * ── The second factor is NOT skipped ────────────────────────────────────────
   * An account with MFA gets the same challenge it gets from a password. Without this, "Sign in with
   * Google" would be a documented bypass of the second factor for every account that has one — the
   * feature would look present and be absent exactly where it matters.
   *
   * ── Identity is resolved in `sub` order, then e-mail ────────────────────────
   * A known `Account` row wins, because `sub` cannot be renamed. The e-mail is only consulted to LINK a
   * previously password-based account, and only under the rules in `resolveGoogleUser`.
   */
  async loginWithGoogle(
    identity: GoogleIdentity,
    context: { ipAddress?: string | undefined; userAgent?: string | undefined },
  ): Promise<LoginOutcome> {
    const user = await this.resolveGoogleUser(identity);

    if (await this.mfa.isEnabled(user.id)) {
      return {
        kind: 'mfa_required',
        challengeToken: await this.tokens.signMfaChallenge(user.id),
        expiresInSeconds: MFA_CHALLENGE_TTL_SECONDS,
      };
    }

    return { kind: 'session', ...(await this.openSession(user, context)) };
  }

  /**
   * Finds the user a Google identity belongs to, linking or creating as the rules allow.
   *
   * ── Linking to an existing account, and the attack it has to survive ────────
   * The dangerous case is a pre-registered account: somebody signs up with `victim@example.com` and a
   * password they know, and when the real owner later uses "Sign in with Google" the flows are merged
   * and the attacker's password now opens the victim's account.
   *
   * The defence is `emailVerifiedAt`: Google only confirms the e-mail when the person controls the
   * mailbox, so linking is safe for an account that has PROVEN its address and refused for one that has
   * not. The refusal is explicit and actionable (sign in with your password, then link from settings)
   * rather than a silent merge, because the alternative is an attacker's account quietly absorbing a
   * legitimate sign-in.
   *
   * ── Creating on first sight ─────────────────────────────────────────────────
   * A brand-new address creates a user, so "Continue with Google" works for a first-time visitor. The
   * account starts with no password and no business membership, which means it can sign in and do
   * nothing else until it is invited or starts a business — harmless, and the behaviour a Google button
   * leads people to expect. This is a product decision rather than a security one, and the switch is
   * this method.
   */
  private async resolveGoogleUser(identity: GoogleIdentity): Promise<SignInUser> {
    const client = this.prisma.getClient();

    const link = await client.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'GOOGLE',
          providerAccountId: identity.providerAccountId,
        },
      },
      select: { userId: true },
    });

    if (link !== null) {
      const linked = await client.user.findUnique({
        where: { id: link.userId },
        select: SIGN_IN_USER_FIELDS,
      });

      // A linked account that is now suspended or deleted: same 401 as anywhere else, so nobody learns
      // the state of an account they cannot sign in to.
      if (linked === null || linked.deletedAt !== null || linked.status !== 'ACTIVE') {
        throw AppException.unauthenticated('Identifiants invalides.');
      }

      return linked;
    }

    const existing = await client.user.findUnique({
      where: { email: identity.email },
      select: SIGN_IN_USER_FIELDS,
    });

    if (existing !== null) {
      if (existing.deletedAt !== null || existing.status !== 'ACTIVE') {
        throw AppException.unauthenticated('Identifiants invalides.');
      }

      if (existing.emailVerifiedAt === null) {
        throw AppException.forbidden(
          'Un compte existe déjà avec cette adresse. Connectez-vous avec votre mot de passe, puis liez Google depuis vos paramètres de sécurité.',
        );
      }

      await this.linkAccount(existing.id, identity);

      return existing;
    }

    return this.createGoogleUser(identity);
  }

  /**
   * Records the link between a user and a Google account.
   *
   * No `accessToken` or `refreshToken` is stored. The flow is `access_type: 'online'` and nothing here
   * calls Google on the user's behalf afterwards, so those columns would hold a credential that is never
   * used — a liability with no reader. They exist on `Account` for the providers that do need them.
   */
  private async linkAccount(userId: string, identity: GoogleIdentity): Promise<void> {
    try {
      await this.prisma.getClient().account.create({
        data: {
          userId,
          provider: 'GOOGLE',
          providerAccountId: identity.providerAccountId,
          scope: GOOGLE_SCOPE,
        },
      });
    } catch (error) {
      // Two callbacks arrived at once — a double-click, or a redirect the browser retried. The other
      // one linked it; the link is what matters, not which request wrote it.
      if (!isUniqueViolation(error)) {
        throw error;
      }
    }
  }

  /**
   * Creates the account for a Google identity nobody has seen before.
   *
   * `emailVerifiedAt` comes from Google's own verification, and it is not cosmetic: it is what allows
   * this user to link a Google sign-in later without hitting the pre-registration defence above.
   */
  private async createGoogleUser(identity: GoogleIdentity): Promise<SignInUser> {
    try {
      return await this.prisma.getClient().user.create({
        data: {
          email: identity.email,
          emailVerifiedAt: identity.emailVerified ? new Date() : null,
          firstName: identity.firstName,
          lastName: identity.lastName,
          avatarUrl: identity.avatarUrl,
          // Deliberately no `passwordHash`: the account has no password until one is set on purpose, and
          // a placeholder hash would be a password nobody chose.
          accounts: {
            create: {
              provider: 'GOOGLE',
              providerAccountId: identity.providerAccountId,
              scope: GOOGLE_SCOPE,
            },
          },
        },
        select: SIGN_IN_USER_FIELDS,
      });
    } catch (error) {
      if (!isUniqueViolation(error)) {
        throw error;
      }

      // The race resolved itself in the other request. Re-resolving finds the row it created, and goes
      // down the linking path rather than creating a second account for the same person.
      return this.resolveGoogleUser(identity);
    }
  }

  /** Opens the session and records the sign-in, as the last step shared by both login paths. */
  private async openSession(
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      status: string;
      platformRole: string | null;
      mustChangePassword: boolean;
      emailVerifiedAt: Date | null;
      locale: string;
    },
    context: { ipAddress?: string | undefined; userAgent?: string | undefined },
  ): Promise<LoginResult> {
    const activeBusinessId = await this.defaultBusinessId(user.id);

    const tokens = await this.tokens.startSession({
      userId: user.id,
      businessId: activeBusinessId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    await this.prisma.getClient().user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        platformRole: user.platformRole,
        mustChangePassword: user.mustChangePassword,
        emailVerifiedAt: user.emailVerifiedAt,
        locale: user.locale,
        activeBusinessId,
      },
    };
  }

  /** Ends one session. Idempotent: signing out twice is not an error worth reporting. */
  async logout(sessionId: string): Promise<void> {
    await this.tokens.revokeSession(sessionId, 'logout');
  }

  /**
   * Rotates the refresh token and returns the same shape `login` does.
   *
   * ── The account is re-checked on every refresh ───────────────────────────────
   * A session can outlive the account's eligibility: suspending a user must not leave them with a
   * working session for the next twenty-nine days. The check costs one primary-key read per refresh,
   * which is nothing next to the fifteen minutes of access the rotation just granted — and when it
   * fails, the whole session is revoked rather than merely refused, so the client stops retrying.
   */
  async refresh(
    refreshToken: string,
    ipAddress?: string | undefined,
    userAgent?: string | undefined,
  ): Promise<LoginResult> {
    const tokens = await this.tokens.rotate({ refreshToken, ipAddress, userAgent });

    const user = await this.prisma.getClient().user.findUnique({
      where: { id: tokens.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        platformRole: true,
        mustChangePassword: true,
        emailVerifiedAt: true,
        locale: true,
        deletedAt: true,
      },
    });

    if (user === null || user.deletedAt !== null || user.status !== 'ACTIVE') {
      await this.tokens.revokeSession(tokens.sessionId, 'account_inactive');

      throw AppException.unauthenticated('Authentification requise.');
    }

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        platformRole: user.platformRole,
        mustChangePassword: user.mustChangePassword,
        emailVerifiedAt: user.emailVerifiedAt,
        locale: user.locale,
        // Carried from the session rather than recomputed: refreshing must not move a user to a
        // different business than the session they are in.
        activeBusinessId: await this.sessionBusinessId(tokens.sessionId),
      },
    };
  }

  /** The business a given session is acting in. */
  private async sessionBusinessId(sessionId: string): Promise<string | undefined> {
    const session = await this.prisma.getClient().session.findUnique({
      where: { id: sessionId },
      select: { businessId: true },
    });

    return session?.businessId ?? undefined;
  }

  /** The caller's own profile. */
  async me(userId: string, activeBusinessId: string | undefined): Promise<AuthenticatedUser> {
    const user = await this.prisma.getClient().user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        platformRole: true,
        mustChangePassword: true,
        emailVerifiedAt: true,
        locale: true,
      },
    });

    if (user === null) {
      // A valid token for a user who no longer exists: the account was deleted between the token being
      // issued and this request arriving.
      throw AppException.unauthenticated('Authentification requise.');
    }

    return { ...user, activeBusinessId };
  }

  /**
   * Creates an account from an e-mail and a password.
   *
   * ── The response never says whether the address was already registered ───────
   * An existing address produces exactly what a new one produces: no error, no body, no way to tell.
   * Otherwise the sign-up form becomes a free account-enumeration oracle, which is the same reasoning
   * that makes every login failure a single 401 — and doing it in one place while not the other would be
   * a hole with a lock on it.
   *
   * ── Which is why the password is hashed even when nothing is created ─────────
   * Returning early on an existing address would make those requests finish in microseconds while a real
   * registration spends the Argon2 cost. Response TIME is just as good an oracle as a message, so the
   * hash is computed in both cases and thrown away in one. This is the same defence as the dummy hash on
   * the login path.
   */
  async register(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<void> {
    const client = this.prisma.getClient();

    // Normalised here because the column is documented as always lower-cased, and that is what makes its
    // unique index genuinely case-insensitive.
    const email = input.email.trim().toLowerCase();

    await this.assertAcceptablePassword(input.password, {
      email,
      firstName: input.firstName,
      lastName: input.lastName,
    });

    // Computed before the existence check, so both paths pay it.
    const passwordHash = await hashPassword(input.password);

    const existing = await client.user.findUnique({ where: { email }, select: { id: true } });

    if (existing !== null) {
      return;
    }

    let created: { id: string };

    try {
      created = await client.user.create({
        data: {
          email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          // Null until the address is proven. It is what the Google linking rule reads, so a
          // freshly-registered account can never be the target of a silent sign-in merge.
          emailVerifiedAt: null,
        },
        select: { id: true },
      });
    } catch (error) {
      // Two sign-ups raced for the same address. The other one won, and what the caller sees must be
      // identical either way.
      if (isUniqueViolation(error)) {
        return;
      }

      throw error;
    }

    await this.sendVerificationEmail(created.id, email);
  }

  /**
   * Proves the e-mail address behind a verification link.
   *
   * One message for every failure — unknown, expired, already used — because telling them apart lets
   * somebody walk the token space and learn which links were ever real.
   */
  async verifyEmail(rawToken: string): Promise<void> {
    const userId = await this.tokens.consumeVerificationToken(rawToken, 'EMAIL_VERIFY');

    if (userId === null) {
      throw new AppException(
        400,
        ERROR_CODES.VALIDATION_FAILED,
        'Ce lien de vérification est invalide ou a expiré.',
      );
    }

    await this.prisma.getClient().user.update({
      where: { id: userId },
      data: { emailVerifiedAt: new Date() },
    });
  }

  /**
   * Changes the password of the signed-in user.
   *
   * ── Why the current password is still required with a valid session ──────────
   * A session is a bearer credential. Asking for the current password is what stops somebody who has
   * borrowed an unlocked laptop — or stolen a session token — from locking the owner out of their own
   * account in two requests.
   *
   * ── Everything else is signed out ───────────────────────────────────────────
   * The usual reason somebody changes a password is that they believe somebody else knows it. Leaving the
   * other devices signed in would mean the change achieved nothing against exactly the person they were
   * worried about. The session making the request is kept: it just proved it knows the new password.
   */
  async changePassword(
    userId: string,
    sessionId: string,
    input: { currentPassword?: string | undefined; newPassword: string },
  ): Promise<void> {
    const client = this.prisma.getClient();

    const user = await client.user.findUnique({
      where: { id: userId },
      select: { email: true, firstName: true, lastName: true, passwordHash: true },
    });

    if (user === null) {
      throw AppException.unauthenticated('Authentification requise.');
    }

    // An account created through Google has no password to confirm. A signed-in session plus the new
    // password is enough to SET one — which is how somebody who signed up with Google adds a password.
    if (user.passwordHash !== null) {
      const matches =
        input.currentPassword !== undefined &&
        (await verifyPassword(user.passwordHash, input.currentPassword));

      if (!matches) {
        throw AppException.unauthenticated('Mot de passe actuel incorrect.');
      }
    }

    await this.assertAcceptablePassword(
      input.newPassword,
      { email: user.email, firstName: user.firstName, lastName: user.lastName },
      'newPassword',
    );

    await client.user.update({
      where: { id: userId },
      data: {
        passwordHash: await hashPassword(input.newPassword),
        // The rotation that was being demanded has now happened.
        mustChangePassword: false,
        // Any lockout was about the OLD password, and keeping it would lock somebody out for a secret
        // they no longer use.
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    await this.tokens.revokeOtherSessions(userId, sessionId, 'password_change');
  }

  /**
   * Refuses a password the policy rejects, or one known to be breached.
   *
   * The error details match the validation pipe's shape — a field name mapped to a list of reasons — so a
   * client renders a policy failure exactly like a DTO failure instead of needing two paths. The MESSAGE
   * is the policy's own text, because unlike a DTO failure this one can say something useful.
   */
  private async assertAcceptablePassword(
    password: string,
    context: { email?: string | undefined; firstName?: string | undefined; lastName?: string | undefined },
    field: 'password' | 'newPassword' = 'password',
  ): Promise<void> {
    const problem = checkPasswordPolicy(password, context);

    if (problem !== null) {
      throw new AppException(400, ERROR_CODES.VALIDATION_FAILED, problem, {
        [field]: ['passwordPolicy'],
      });
    }

    if (await this.breached.isBreached(password)) {
      throw new AppException(
        400,
        ERROR_CODES.VALIDATION_FAILED,
        'Ce mot de passe apparaît dans des fuites de données connues. Choisissez-en un autre.',
        { [field]: ['breachedPassword'] },
      );
    }
  }

  /**
   * Hands the verification link to the delivery mechanism.
   *
   * There is no delivery mechanism yet — the email service through BullMQ is the next slice — so the link
   * is logged at `debug`, which is the development default. That makes the flow walkable end to end
   * locally rather than a dead end, and it is deliberately `debug` rather than `info` so the token cannot
   * reach production logs by accident.
   */
  private async sendVerificationEmail(userId: string, email: string): Promise<void> {
    const token = await this.tokens.createVerificationToken(
      userId,
      'EMAIL_VERIFY',
      VERIFY_EMAIL_TTL_SECONDS,
    );

    this.logger.debug(
      `Verification link for ${email}: ${this.env.frontendUrl}/verifier-email?token=${token}`,
    );
  }

  /**
   * Verifies a password, spending the same time whether or not there is a hash to check.
   *
   * A Google-only account has no password, so no password can be correct — but returning early would
   * make those accounts measurably faster to probe than password accounts.
   */
  private async checkPassword(storedHash: string | null, plaintext: string): Promise<boolean> {
    if (storedHash === null) {
      await verifyPassword(await DUMMY_HASH_PROMISE, plaintext);

      return false;
    }

    return verifyPassword(storedHash, plaintext);
  }

  /**
   * Increments the failure counter, and locks the account once the policy's threshold is reached.
   *
   * The threshold and duration come from the validated environment rather than from constants, so the
   * policy is one value read at boot instead of a number scattered through the code.
   */
  private async recordFailedAttempt(userId: string, currentAttempts: number): Promise<void> {
    const attempts = currentAttempts + 1;
    const shouldLock = attempts >= this.env.auth.lockout.maxFailedAttempts;

    await this.prisma.getClient().user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: attempts,
        lockedUntil: shouldLock
          ? new Date(Date.now() + this.env.auth.lockout.durationSeconds * 1000)
          : null,
      },
    });
  }

  /**
   * The business a new session starts in.
   *
   * Read through `runAsTenant`, and that is not optional: `business_member` is under row-level security
   * and its read policy admits a row only when `user_id` matches the context. Querying it from a
   * connection with no context returns ZERO rows — so the obvious implementation would silently give
   * every user a session with no active business, and nothing would look broken until a dashboard
   * rendered empty.
   */
  private async defaultBusinessId(userId: string): Promise<string | undefined> {
    const membership = await runAsTenant(this.prisma.getClient(), { userId }, (tx) =>
      tx.businessMember.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        select: { businessId: true },
      }),
    );

    return membership?.businessId;
  }
}
