import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { AppException } from '../../common/errors/app.exception.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { PUBLIC_ROUTE } from './auth.decorators.js';
import type { AccessTokenPayload, RequestWithAuth } from './auth.types.js';

/** `Authorization: Bearer <token>`. Case-insensitive on the scheme, per RFC 7235. */
function bearerToken(header: string | undefined): string | undefined {
  if (header === undefined) {
    return undefined;
  }

  const [scheme, value] = header.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || value === undefined || value === '') {
    return undefined;
  }

  return value;
}

/**
 * Verifies the access token AND that its session is still alive.
 *
 * ── Why the second check costs a query ───────────────────────────────────────
 * A JWT cannot be taken back: once signed, it verifies until it expires, and "sign this device out"
 * would be a lie if the token kept working. The token therefore names its session (`sid`) and this
 * guard looks that session up. The access token stays short-lived so this one indexed primary-key
 * lookup is the whole cost of revocation.
 *
 * ── Same message for every failure ───────────────────────────────────────────
 * Missing header, malformed token, bad signature, expired, revoked session, and a token whose `sub`
 * disagrees with its session all produce one indistinguishable 401. Telling them apart would let a
 * caller learn which of their guesses was close, and the honest answer to all six is "sign in again".
 *
 * Registered globally in `AuthModule`, so a new controller is protected by default and has to opt out
 * with `@Public()`.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic === true) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithAuth>();

    const payload = await this.verifyAccessToken(bearerToken(request.headers.authorization));

    const session = await this.prisma.getClient().session.findUnique({
      where: { id: payload.sid },
      select: { id: true, userId: true, businessId: true, revokedAt: true, expiresAt: true },
    });

    if (
      session === null ||
      session.revokedAt !== null ||
      session.expiresAt.getTime() <= Date.now() ||
      // A token whose `sub` disagrees with its session is not a token we issued coherently; refusing it
      // means a bug upstream cannot become a way to act as somebody else.
      session.userId !== payload.sub
    ) {
      throw AppException.unauthenticated('Authentification requise.');
    }

    // The SESSION is the source of truth for the business, not the token's `bid`: a user may switch
    // business without a new token, and trusting the claim would let a stale token keep operating in
    // the wrong tenant.
    request.auth = {
      userId: session.userId,
      sessionId: session.id,
      businessId: session.businessId ?? undefined,
    };

    return true;
  }

  private async verifyAccessToken(token: string | undefined): Promise<AccessTokenPayload> {
    if (token === undefined) {
      throw AppException.unauthenticated('Authentification requise.');
    }

    try {
      const payload = await this.jwt.verifyAsync<AccessTokenPayload>(token);

      // The session claim is REQUIRED, not merely used. An MFA challenge token is signed with the same
      // key and carries no `sid`, so without this check a challenge — a credential worth as much as a
      // password and valid for five minutes — would reach the session lookup as `undefined` and either
      // error or, worse, match something. Requiring the claim is what keeps the two token types apart.
      if (typeof payload.sid !== 'string' || typeof payload.sub !== 'string') {
        throw new Error('missing session claim');
      }

      return payload;
    } catch {
      // Expired, badly signed, not a JWT at all, or the wrong KIND of token. The library's own errors are
      // detailed enough to be useful to an attacker and are deliberately discarded.
      throw AppException.unauthenticated('Authentification requise.');
    }
  }
}
