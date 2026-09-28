import { Inject, Injectable } from '@nestjs/common';

import { AppException } from '../../common/errors/app.exception.js';
import type { ApiEnv } from '../../config/env.js';
import { API_ENV } from '../../config/env.token.js';
import { hashPassword, verifyPassword } from '../../infra/crypto/password.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { runAsTenant } from '../../infra/prisma/tenant-context.js';
import { TokenService, type IssuedTokens } from './token.service.js';

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
  ) {}

  async login(input: {
    email: string;
    password: string;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
  }): Promise<LoginResult> {
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

    const activeBusinessId = await this.defaultBusinessId(user.id);

    const tokens = await this.tokens.startSession({
      userId: user.id,
      businessId: activeBusinessId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });

    // Counters reset and the sign-in recorded only once everything else has succeeded: a login that
    // fails at the last step must not clear the lockout counter.
    await client.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
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
