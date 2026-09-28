import { createHmac, randomBytes, randomUUID } from 'node:crypto';

import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppException } from '../../common/errors/app.exception.js';
import type { ApiEnv } from '../../config/env.js';
import { API_ENV } from '../../config/env.token.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';

/**
 * How long a password-verified caller has to supply their second factor.
 *
 * Short on purpose: the challenge token is a bearer credential that proves the password step passed, so
 * it is worth as much as a password. Five minutes is enough to find a phone and open an authenticator,
 * and short enough that a leaked one is usually stale by the time it is found.
 */
export const MFA_CHALLENGE_TTL_SECONDS = 300;

/** Marks a token as an MFA challenge, so it can never be mistaken for an access token. */
const MFA_CHALLENGE_TYPE = 'mfa_challenge';

export interface SessionOwner {
  userId: string;
  businessId?: string | undefined;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
}

export interface IssuedTokens {
  sessionId: string;
  /**
   * The user the session belongs to.
   *
   * Returned rather than looked up again: the caller almost always needs it immediately (to build a
   * response body), and re-reading it by session id would be a second query for something the rotation
   * already had in hand.
   */
  userId: string;
  /** The RAW refresh token. Only ever returned to the caller; the database holds a keyed hash. */
  refreshToken: string;
  accessToken: string;
  accessExpiresInSeconds: number;
}

/**
 * Sessions and the two-token scheme.
 *
 * ── Access token: a JWT, and the refresh token is NOT ────────────────────────
 * The access token is stateless and short-lived, so verifying it costs no query — which is the whole
 * point, since it is checked on every request. The refresh token is an OPAQUE random string looked up
 * in the database. A JWT refresh token would stay valid until it expired no matter what the database
 * said, and revoking a stolen session is the one thing this design exists to do.
 *
 * ── The stored value is a keyed hash, not the token ──────────────────────────
 * HMAC-SHA256 with `JWT_REFRESH_SECRET`. The token is 256 bits of randomness, so a bare hash would
 * already be unguessable; keying it means a database dump alone cannot be used to check a guessed
 * token offline, and it gives the declared refresh secret a real job.
 *
 * ── Rotation, and why reuse is treated as theft ──────────────────────────────
 * Every refresh issues a new token and revokes the one presented, all within a `familyId`. Presenting
 * a token that is already revoked is the signature of a stolen token being replayed — the legitimate
 * holder has moved on and someone else is behind. The response is to revoke the WHOLE family, signing
 * out both parties. That is a deliberate trade: a double-submitted request can trip it and sign a user
 * out, and being signed out is a far better outcome than leaving a stolen token usable.
 *
 * ── The signing key comes from `ApiEnv`, through the module factory ──────────
 * `JwtModule.registerAsync` is given the validated environment, so the secret has one source of truth
 * and is still checked at boot by `loadEnv` — rather than a second, hand-read copy of `process.env`
 * living in this file.
 */
@Injectable()
export class TokenService {
  constructor(
    @Inject(API_ENV) private readonly env: ApiEnv,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  /** 32 bytes of randomness, URL-safe and therefore safe in a cookie. */
  private static generateRefreshToken(): string {
    return randomBytes(32).toString('base64url');
  }

  /**
   * The value stored in `RefreshToken.tokenHash`.
   *
   * `@db.VarChar(64)` in the schema is sized for exactly this: SHA-256 in hex.
   */
  hashRefreshToken(rawToken: string): string {
    return createHmac('sha256', this.env.auth.refreshSecret).update(rawToken).digest('hex');
  }

  /**
   * Signs a short-lived access token.
   *
   * The claims are deliberately few. `sid` is what makes a stateless token revocable in practice: the
   * guards check that the session it names is still alive, so a token that cannot be unsaid can still
   * be refused.
   */
  signAccessToken(context: {
    userId: string;
    sessionId: string;
    businessId?: string | undefined;
  }): Promise<string> {
    return this.jwt.signAsync({
      sub: context.userId,
      sid: context.sessionId,
      ...(context.businessId === undefined ? {} : { bid: context.businessId }),
    });
  }

  /**
   * A short-lived token proving the PASSWORD step passed, for a caller who owes a second factor.
   *
   * ── Why a token rather than a server-side row ────────────────────────────────
   * It carries no session and grants nothing on its own: it says "this person knows the password" for
   * five minutes, and the only thing it unlocks is the MFA verification endpoint. A database row would
   * mean a write on every login attempt that then has to be cleaned up, for a piece of state that
   * expires on its own.
   *
   * ── Why it is typed ─────────────────────────────────────────────────────────
   * Signed with the same key as access tokens, because there is one signing key. The `typ` claim is what
   * keeps the two apart, and `JwtAuthGuard` refuses any token without the session claim it needs — so a
   * challenge cannot be presented as an access token even if this marker were somehow lost.
   */
  signMfaChallenge(userId: string): Promise<string> {
    return this.jwt.signAsync(
      { sub: userId, typ: MFA_CHALLENGE_TYPE },
      { expiresIn: MFA_CHALLENGE_TTL_SECONDS },
    );
  }

  /** Verifies a challenge token and returns the user it belongs to. */
  async verifyMfaChallenge(token: string): Promise<string> {
    try {
      const payload = await this.jwt.verifyAsync<{ sub?: string; typ?: string }>(token);

      if (payload.typ !== MFA_CHALLENGE_TYPE || typeof payload.sub !== 'string') {
        throw new Error('not an MFA challenge');
      }

      return payload.sub;
    } catch {
      // Expired, forged, or an access token presented as a challenge — all the same answer.
      throw AppException.unauthenticated('Vérification MFA expirée. Reconnectez-vous.');
    }
  }

  /** Opens a session and issues its first access and refresh pair. */
  async startSession(owner: SessionOwner): Promise<IssuedTokens> {
    const refreshToken = TokenService.generateRefreshToken();
    const expiresAt = this.refreshExpiry();

    const session = await this.prisma.getClient().session.create({
      data: {
        userId: owner.userId,
        businessId: owner.businessId ?? null,
        ipAddress: owner.ipAddress ?? null,
        userAgent: owner.userAgent ?? null,
        expiresAt,
        refreshTokens: {
          create: {
            tokenHash: this.hashRefreshToken(refreshToken),
            // One id for the whole chain of rotations this session will produce.
            familyId: randomUUID(),
            expiresAt,
          },
        },
      },
      select: { id: true },
    });

    return {
      sessionId: session.id,
      userId: owner.userId,
      refreshToken,
      accessToken: await this.signAccessToken({
        userId: owner.userId,
        sessionId: session.id,
        businessId: owner.businessId,
      }),
      accessExpiresInSeconds: this.env.auth.accessTtlSeconds,
    };
  }

  /**
   * Exchanges a refresh token for a new pair, rotating it.
   *
   * The presented token is revoked BEFORE the replacement is issued, inside one transaction. If the
   * process dies in between, the user signs in again — recoverable. The other order leaves two live
   * refresh tokens whenever a request is interrupted, which is not.
   */
  async rotate(input: {
    refreshToken: string;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
  }): Promise<IssuedTokens> {
    const client = this.prisma.getClient();
    const tokenHash = this.hashRefreshToken(input.refreshToken);

    const stored = await client.refreshToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        familyId: true,
        sessionId: true,
        expiresAt: true,
        revokedAt: true,
        session: { select: { id: true, userId: true, businessId: true, revokedAt: true } },
      },
    });

    if (stored === null) {
      throw AppException.unauthenticated('Session invalide ou expirée.');
    }

    if (stored.revokedAt !== null) {
      // Reuse: the legitimate holder already exchanged this token, so whoever is asking now is either
      // the same client retrying or somebody who took it. Both get the family revoked.
      await this.revokeFamily(stored.familyId, 'refresh_reuse');

      throw AppException.unauthenticated('Session invalide ou expirée.', { reason: 'refresh_reuse' });
    }

    if (stored.session.revokedAt !== null) {
      throw AppException.unauthenticated('Session invalide ou expirée.', {
        reason: 'session_revoked',
      });
    }

    if (stored.expiresAt.getTime() <= Date.now()) {
      // Expiry is not theft, so the family is left alone: the user signs in again and their other
      // devices keep working.
      await client.refreshToken.update({
        where: { id: stored.id },
        data: { revokedAt: new Date(), revokedReason: 'expired' },
      });

      throw AppException.unauthenticated('Session invalide ou expirée.', { reason: 'expired' });
    }

    const nextToken = TokenService.generateRefreshToken();
    const expiresAt = this.refreshExpiry();

    await client.$transaction(async (tx) => {
      const created = await tx.refreshToken.create({
        data: {
          sessionId: stored.sessionId,
          tokenHash: this.hashRefreshToken(nextToken),
          // Same family: a rotation continues a chain rather than starting one.
          familyId: stored.familyId,
          expiresAt,
        },
        select: { id: true },
      });

      await tx.refreshToken.update({
        where: { id: stored.id },
        data: { revokedAt: new Date(), revokedReason: 'rotated', replacedById: created.id },
      });
    });

    return {
      sessionId: stored.sessionId,
      userId: stored.session.userId,
      refreshToken: nextToken,
      accessToken: await this.signAccessToken({
        userId: stored.session.userId,
        sessionId: stored.sessionId,
        businessId: stored.session.businessId ?? undefined,
      }),
      accessExpiresInSeconds: this.env.auth.accessTtlSeconds,
    };
  }

  /** Signs a session out: the session and every token in it stop working immediately. */
  async revokeSession(sessionId: string, reason: string): Promise<void> {
    const client = this.prisma.getClient();
    const now = new Date();

    await client.$transaction([
      client.refreshToken.updateMany({
        where: { sessionId, revokedAt: null },
        data: { revokedAt: now, revokedReason: reason },
      }),
      client.session.updateMany({
        where: { id: sessionId, revokedAt: null },
        data: { revokedAt: now, revokedReason: reason },
      }),
    ]);
  }

  /**
   * Revokes every token sharing a family, and the session they belong to.
   *
   * This is the response to detection, not routine cleanup: the family is the blast radius of one
   * stolen token, and shrinking it is the whole reason `familyId` exists.
   */
  async revokeFamily(familyId: string, reason: string): Promise<void> {
    const client = this.prisma.getClient();
    const now = new Date();

    const tokens = await client.refreshToken.findMany({
      where: { familyId },
      select: { sessionId: true },
    });

    const sessionIds = [...new Set(tokens.map((token) => token.sessionId))];

    await client.$transaction([
      client.refreshToken.updateMany({
        where: { familyId, revokedAt: null },
        data: { revokedAt: now, revokedReason: reason },
      }),
      client.session.updateMany({
        where: { id: { in: sessionIds }, revokedAt: null },
        data: { revokedAt: now, revokedReason: reason },
      }),
    ]);
  }

  /**
   * Signs out every session for a user except the one making the request.
   *
   * Used after a password change: the usual reason somebody changes their password is that they believe
   * it is known to somebody else, and leaving the other devices signed in would mean the change achieved
   * nothing against the person they were worried about. The current session is kept deliberately — the
   * person who just proved they know the new password should not be thrown out of the page they are on.
   *
   * `Session.revokedReason` documents 'password_change' as one of its values, so this is completing the
   * design rather than inventing a convention.
   */
  async revokeOtherSessions(
    userId: string,
    keepSessionId: string,
    reason: string,
  ): Promise<void> {
    const client = this.prisma.getClient();
    const now = new Date();

    const others = await client.session.findMany({
      where: { userId, id: { not: keepSessionId }, revokedAt: null },
      select: { id: true },
    });

    const sessionIds = others.map((session) => session.id);

    if (sessionIds.length === 0) {
      return;
    }

    await client.$transaction([
      client.refreshToken.updateMany({
        where: { sessionId: { in: sessionIds }, revokedAt: null },
        data: { revokedAt: now, revokedReason: reason },
      }),
      client.session.updateMany({
        where: { id: { in: sessionIds }, revokedAt: null },
        data: { revokedAt: now, revokedReason: reason },
      }),
    ]);
  }

  /**
   * The stored hash of a single-use verification token.
   *
   * Keyed, like the refresh token, so a database dump is not enough to check a guessed token offline —
   * and namespaced by purpose, so a token minted to verify an e-mail can never be presented as one that
   * resets a password. The schema permits one row per purpose, and this is what keeps the purposes apart
   * even though they share a column.
   */
  hashVerificationToken(rawToken: string, purpose: string): string {
    return createHmac('sha256', this.env.auth.refreshSecret)
      .update(`${purpose}:${rawToken}`)
      .digest('hex');
  }

  /**
   * Mints a single-use verification token and stores only its hash.
   *
   * The raw value is returned so the caller can put it in an email — the one moment it exists. Nothing
   * can read it back afterwards, which is the property that makes a leaked database useless: an attacker
   * cannot verify an address or reset a password with a table dump alone.
   */
  async createVerificationToken(
    userId: string,
    purpose: 'EMAIL_VERIFY' | 'PASSWORD_RESET' | 'MFA_RESET' | 'INVITATION',
    ttlSeconds: number,
  ): Promise<string> {
    const rawToken = randomBytes(32).toString('base64url');

    await this.prisma.getClient().verificationToken.create({
      data: {
        userId,
        purpose,
        tokenHash: this.hashVerificationToken(rawToken, purpose),
        expiresAt: new Date(Date.now() + ttlSeconds * 1000),
      },
    });

    return rawToken;
  }

  /**
   * Consumes a verification token, returning the user it belongs to.
   *
   * Returns `null` rather than throwing for every failure — unknown, expired, already used, wrong
   * purpose — because the caller must not be able to tell them apart. The `consumedAt: null` in the
   * update's WHERE clause is what makes it single-use under a race: two simultaneous requests both see
   * the row, and only one update matches it.
   */
  async consumeVerificationToken(
    rawToken: string,
    purpose: 'EMAIL_VERIFY' | 'PASSWORD_RESET' | 'MFA_RESET' | 'INVITATION',
  ): Promise<string | null> {
    const client = this.prisma.getClient();

    const stored = await client.verificationToken.findUnique({
      where: { tokenHash: this.hashVerificationToken(rawToken, purpose) },
      select: { id: true, userId: true, purpose: true, expiresAt: true, consumedAt: true },
    });

    if (
      stored === null ||
      stored.purpose !== purpose ||
      stored.consumedAt !== null ||
      stored.expiresAt.getTime() <= Date.now()
    ) {
      return null;
    }

    const consumed = await client.verificationToken.updateMany({
      where: { id: stored.id, consumedAt: null },
      data: { consumedAt: new Date() },
    });

    return consumed.count === 1 ? stored.userId : null;
  }

  private refreshExpiry(): Date {
    return new Date(Date.now() + this.env.auth.refreshTtlSeconds * 1000);
  }
}
