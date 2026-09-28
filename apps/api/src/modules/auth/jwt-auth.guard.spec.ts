import type { ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';

import { AppException } from '../../common/errors/app.exception.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import type { RequestWithAuth } from './auth.types.js';

/**
 * The guard that protects every route in the application by default.
 *
 * Each refusal produces the SAME 401 — missing header, malformed token, bad signature, expired, revoked
 * session, or a token whose subject disagrees with its session. Anything more specific would tell a
 * caller which of their guesses was closest, so the interesting assertion is often not just "refused"
 * but "refused with nothing to learn from".
 */
describe('JwtAuthGuard', () => {
  const session = {
    id: 'session-1',
    userId: 'user-1',
    businessId: 'biz-1',
    revokedAt: null as Date | null,
    expiresAt: new Date(Date.now() + 3_600_000),
  };

  let prisma: { getClient: () => { session: { findUnique: jest.Mock } } };
  let jwt: { verifyAsync: jest.Mock };
  let reflector: { getAllAndOverride: jest.Mock };
  let guard: JwtAuthGuard;
  let request: RequestWithAuth;

  /**
   * One client instance, reused.
   *
   * `getClient()` must return the SAME object every time: returning a fresh one per call means the mock
   * a test configures is not the mock the guard consults, and the lookup silently resolves to
   * `undefined` — which is how this spec first failed.
   */
  let client: { session: { findUnique: jest.Mock } };

  /** The lookup's outcome, for the test being written. */
  function sessionLookup(value: unknown): void {
    client.session.findUnique.mockResolvedValue(value);
  }

  function contextFor(): ExecutionContext {
    return {
      getHandler: () => 'handler',
      getClass: () => 'class',
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
  }

  beforeEach(() => {
    request = { headers: {} } as RequestWithAuth;

    client = { session: { findUnique: jest.fn() } };
    prisma = { getClient: () => client };
    jwt = { verifyAsync: jest.fn() };
    reflector = { getAllAndOverride: jest.fn().mockReturnValue(false) };

    guard = new JwtAuthGuard(
      reflector as unknown as Reflector,
      jwt as never,
      prisma as unknown as PrismaService,
    );
  });

  it('lets a route marked @Public() through without a token', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    await expect(guard.canActivate(contextFor())).resolves.toBe(true);
    // Not merely allowed: no lookup happens at all, so an open route costs nothing extra.
    expect(jwt.verifyAsync).not.toHaveBeenCalled();
  });

  it('refuses a request with no Authorization header', async () => {
    await expect(guard.canActivate(contextFor())).rejects.toMatchObject({
      code: 'UNAUTHENTICATED',
      status: 401,
    });
  });

  it('refuses a non-Bearer scheme', async () => {
    request.headers.authorization = 'Basic dXNlcjpwYXNz';

    await expect(guard.canActivate(contextFor())).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
  });

  it('refuses a malformed token, and discards the library diagnosis', async () => {
    request.headers.authorization = 'Bearer not-a-jwt';
    jwt.verifyAsync.mockRejectedValue(new Error('jwt malformed'));

    // The message must not carry the library's reason: it is useful to an attacker and useless to a
    // legitimate caller, who only needs to know to sign in again.
    await expect(guard.canActivate(contextFor())).rejects.toMatchObject({
      code: 'UNAUTHENTICATED',
      message: 'Authentification requise.',
    });
  });

  it('refuses a valid token whose session no longer exists', async () => {
    request.headers.authorization = 'Bearer good';
    jwt.verifyAsync.mockResolvedValue({ sub: 'user-1', sid: 'session-1' });
    sessionLookup(null);

    await expect(guard.canActivate(contextFor())).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
  });

  it('refuses a valid token whose session was REVOKED', async () => {
    // The whole reason the guard costs a query: signing a device out has to take effect immediately,
    // and a JWT cannot be unsigned.
    request.headers.authorization = 'Bearer good';
    jwt.verifyAsync.mockResolvedValue({ sub: 'user-1', sid: 'session-1' });
    sessionLookup({ ...session, revokedAt: new Date() });

    await expect(guard.canActivate(contextFor())).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
  });

  it('refuses a valid token whose session has EXPIRED', async () => {
    request.headers.authorization = 'Bearer good';
    jwt.verifyAsync.mockResolvedValue({ sub: 'user-1', sid: 'session-1' });
    sessionLookup({ ...session, expiresAt: new Date(Date.now() - 1_000) });

    await expect(guard.canActivate(contextFor())).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
  });

  it('refuses a token whose subject disagrees with its session', async () => {
    // Not a token we issued coherently. Refusing it means an upstream bug cannot become a way to act as
    // somebody else.
    request.headers.authorization = 'Bearer good';
    jwt.verifyAsync.mockResolvedValue({ sub: 'someone-else', sid: 'session-1' });
    sessionLookup(session);

    await expect(guard.canActivate(contextFor())).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
  });

  it('attaches the principal from the SESSION, not from the token claims', async () => {
    request.headers.authorization = 'Bearer good';
    // The token claims a DIFFERENT business than the session holds.
    jwt.verifyAsync.mockResolvedValue({ sub: 'user-1', sid: 'session-1', bid: 'stale-biz' });
    sessionLookup(session);

    await expect(guard.canActivate(contextFor())).resolves.toBe(true);

    // The session wins. A user may switch business without a new token, so trusting the claim would let
    // a stale token keep operating in the wrong tenant — a failure row-level security cannot catch,
    // because the query would be legitimately scoped to the wrong business.
    expect(request.auth).toEqual({
      userId: 'user-1',
      sessionId: 'session-1',
      businessId: 'biz-1',
    });
  });

  it('accepts a case-insensitive Bearer scheme, per RFC 7235', async () => {
    request.headers.authorization = 'bearer good';
    jwt.verifyAsync.mockResolvedValue({ sub: 'user-1', sid: 'session-1' });
    sessionLookup(session);

    await expect(guard.canActivate(contextFor())).resolves.toBe(true);
  });

  it('leaves businessId undefined for a user in no business', async () => {
    // Platform staff belong to no tenant, and the type says so rather than carrying an empty string.
    request.headers.authorization = 'Bearer good';
    jwt.verifyAsync.mockResolvedValue({ sub: 'user-1', sid: 'session-1' });
    sessionLookup({ ...session, businessId: null });

    await guard.canActivate(contextFor());

    expect(request.auth?.businessId).toBeUndefined();
  });

  it('throws AppException, so the global filter can shape the envelope', async () => {
    await expect(guard.canActivate(contextFor())).rejects.toBeInstanceOf(AppException);
  });
});
