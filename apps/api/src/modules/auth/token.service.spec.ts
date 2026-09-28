import { ApiEnv } from '../../config/env.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { makeTestEnv } from '../../../test/helpers/test-env.js';
import { TokenService } from './token.service.js';

/**
 * Token rotation and reuse detection.
 *
 * These are the assertions the plan asks for — "unit: token rotation" — and they are unit tests
 * because a real database would only confirm that Prisma can write rows. What is worth pinning is the
 * LOGIC: that a rotation continues its family rather than starting one, that a replayed token takes the
 * whole family down with it, and that an expired token does not (expiry is not theft).
 */
describe('TokenService', () => {
  const env = makeTestEnv({
    auth: {
      ...makeTestEnv().auth,
      accessTtlSeconds: 900,
      refreshTtlSeconds: 2_592_000,
    },
  }) as ApiEnv;

  let client: {
    session: { create: jest.Mock; updateMany: jest.Mock };
    refreshToken: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  let jwt: { signAsync: jest.Mock };
  let service: TokenService;

  beforeEach(() => {
    client = {
      session: { create: jest.fn(), updateMany: jest.fn() },
      refreshToken: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      // Supports both shapes the service uses: the interactive callback and the array of operations.
      $transaction: jest.fn(async (work: unknown) =>
        typeof work === 'function'
          ? (work as (tx: typeof client) => Promise<unknown>)(client)
          : Promise.all(work as Promise<unknown>[]),
      ),
    };

    jwt = { signAsync: jest.fn().mockResolvedValue('signed.jwt.token') };

    service = new TokenService(
      env,
      { getClient: () => client } as unknown as PrismaService,
      jwt as never,
    );
  });

  // ── The stored hash ─────────────────────────────────────────────────────────

  describe('hashRefreshToken', () => {
    it('is deterministic and sized for the column', () => {
      const first = service.hashRefreshToken('a-token');

      expect(service.hashRefreshToken('a-token')).toBe(first);
      // `tokenHash` is VarChar(64), sized for SHA-256 in hex.
      expect(first).toMatch(/^[0-9a-f]{64}$/);
    });

    it('is KEYED, so the same token hashes differently under another secret', () => {
      const other = new TokenService(
        { ...env, auth: { ...env.auth, refreshSecret: 'a-completely-different-secret-value' } },
        { getClient: () => client } as unknown as PrismaService,
        jwt as never,
      );

      // This is the property that makes a database dump insufficient to check a guessed token.
      expect(other.hashRefreshToken('a-token')).not.toBe(service.hashRefreshToken('a-token'));
    });
  });

  // ── Opening a session ───────────────────────────────────────────────────────

  describe('startSession', () => {
    it('stores a hash, never the token, and returns the raw token once', async () => {
      client.session.create.mockResolvedValue({ id: 'session-1' });

      const issued = await service.startSession({ userId: 'user-1', businessId: 'biz-1' });

      expect(issued.sessionId).toBe('session-1');
      expect(issued.refreshToken).toMatch(/^[A-Za-z0-9_-]{43}$/); // 32 random bytes, base64url
      expect(issued.accessToken).toBe('signed.jwt.token');
      expect(issued.accessExpiresInSeconds).toBe(900);

      const created = client.session.create.mock.calls[0][0].data;
      const tokenRow = created.refreshTokens.create;

      // The stored value must not BE the token: that is the whole point of hashing it.
      expect(tokenRow.tokenHash).not.toBe(issued.refreshToken);
      expect(tokenRow.tokenHash).toBe(service.hashRefreshToken(issued.refreshToken));
      expect(tokenRow.familyId).toEqual(expect.any(String));
    });

    it('records the device and IP, which is what Settings → Sécurité lists', async () => {
      client.session.create.mockResolvedValue({ id: 'session-1' });

      await service.startSession({
        userId: 'user-1',
        ipAddress: '41.82.0.14',
        userAgent: 'Mozilla/5.0',
      });

      expect(client.session.create.mock.calls[0][0].data).toMatchObject({
        ipAddress: '41.82.0.14',
        userAgent: 'Mozilla/5.0',
        businessId: null,
      });
    });
  });

  // ── Rotation ────────────────────────────────────────────────────────────────

  describe('rotate', () => {
    const liveToken = {
      id: 'token-1',
      familyId: 'family-1',
      sessionId: 'session-1',
      expiresAt: new Date(Date.now() + 86_400_000),
      revokedAt: null,
      session: { id: 'session-1', userId: 'user-1', businessId: 'biz-1', revokedAt: null },
    };

    it('issues a new token in the SAME family and revokes the one presented', async () => {
      client.refreshToken.findUnique.mockResolvedValue(liveToken);
      client.refreshToken.create.mockResolvedValue({ id: 'token-2' });

      const issued = await service.rotate({ refreshToken: 'the-old-token' });

      expect(issued.sessionId).toBe('session-1');
      expect(issued.refreshToken).not.toBe('the-old-token');

      const created = client.refreshToken.create.mock.calls[0][0].data;
      // A rotation continues a chain. A new familyId here would make reuse undetectable, because the
      // old token would look like it belonged to a different session entirely.
      expect(created.familyId).toBe('family-1');
      expect(created.sessionId).toBe('session-1');
      expect(created.tokenHash).toBe(service.hashRefreshToken(issued.refreshToken));

      // The old one is revoked and POINTS AT its replacement, so the chain can be walked backwards
      // when investigating a session.
      expect(client.refreshToken.update.mock.calls[0][0].data).toMatchObject({
        revokedReason: 'rotated',
        replacedById: 'token-2',
      });
    });

    it('looks the token up by HASH, not by value', async () => {
      client.refreshToken.findUnique.mockResolvedValue(liveToken);
      client.refreshToken.create.mockResolvedValue({ id: 'token-2' });

      await service.rotate({ refreshToken: 'the-old-token' });

      expect(client.refreshToken.findUnique.mock.calls[0][0].where.tokenHash).toBe(
        service.hashRefreshToken('the-old-token'),
      );
    });

    it('treats a REPLAYED token as theft and revokes the whole family', async () => {
      // The legitimate holder already exchanged this token, so whoever is asking now took it.
      client.refreshToken.findUnique.mockResolvedValue({ ...liveToken, revokedAt: new Date() });
      client.refreshToken.findMany.mockResolvedValue([{ sessionId: 'session-1' }]);

      await expect(service.rotate({ refreshToken: 'stolen-token' })).rejects.toMatchObject({
        code: 'UNAUTHENTICATED',
        details: { reason: 'refresh_reuse' },
      });

      const familyRevoke = client.refreshToken.updateMany.mock.calls[0][0];
      expect(familyRevoke.where).toMatchObject({ familyId: 'family-1', revokedAt: null });
      expect(familyRevoke.data.revokedReason).toBe('refresh_reuse');

      // The session goes too: leaving it alive would let the thief keep using the access token until
      // it expired on its own.
      expect(client.session.updateMany.mock.calls[0][0]).toMatchObject({
        where: { id: { in: ['session-1'] }, revokedAt: null },
        data: { revokedReason: 'refresh_reuse' },
      });

      // And nothing new is issued.
      expect(client.refreshToken.create).not.toHaveBeenCalled();
    });

    it('refuses an unknown token without touching any family', async () => {
      client.refreshToken.findUnique.mockResolvedValue(null);

      await expect(service.rotate({ refreshToken: 'never-issued' })).rejects.toMatchObject({
        code: 'UNAUTHENTICATED',
      });

      expect(client.refreshToken.updateMany).not.toHaveBeenCalled();
    });

    it('refuses a token whose session was revoked, WITHOUT revoking the family', async () => {
      // Signing out is not theft. Tearing down the family here would be a no-op for this user and a
      // surprising side effect for anybody else in it.
      client.refreshToken.findUnique.mockResolvedValue({
        ...liveToken,
        session: { ...liveToken.session, revokedAt: new Date() },
      });

      await expect(service.rotate({ refreshToken: 'live-token' })).rejects.toMatchObject({
        details: { reason: 'session_revoked' },
      });

      expect(client.refreshToken.updateMany).not.toHaveBeenCalled();
    });

    it('refuses an EXPIRED token and marks it expired, without revoking the family', async () => {
      // Expiry is not theft either: the user signs in again and their other devices keep working.
      client.refreshToken.findUnique.mockResolvedValue({
        ...liveToken,
        expiresAt: new Date(Date.now() - 1_000),
      });

      await expect(service.rotate({ refreshToken: 'old-token' })).rejects.toMatchObject({
        details: { reason: 'expired' },
      });

      expect(client.refreshToken.updateMany).not.toHaveBeenCalled();
      expect(client.refreshToken.update.mock.calls[0][0].data.revokedReason).toBe('expired');
    });
  });

  // ── Revocation ──────────────────────────────────────────────────────────────

  describe('revocation', () => {
    it('revokes a session and every token in it in one transaction', async () => {
      await service.revokeSession('session-1', 'logout');

      expect(client.refreshToken.updateMany.mock.calls[0][0]).toMatchObject({
        where: { sessionId: 'session-1', revokedAt: null },
        data: { revokedReason: 'logout' },
      });
      expect(client.session.updateMany.mock.calls[0][0].data.revokedReason).toBe('logout');
      // One transaction, so a session can never be left revoked while its tokens still work.
      expect(client.$transaction).toHaveBeenCalledTimes(1);
    });

    it('deduplicates the sessions found in a family', async () => {
      // Every rotation in one session shares a family, so the naive query returns the same session id
      // many times over.
      client.refreshToken.findMany.mockResolvedValue([
        { sessionId: 'session-1' },
        { sessionId: 'session-1' },
        { sessionId: 'session-2' },
      ]);

      await service.revokeFamily('family-1', 'refresh_reuse');

      expect(client.session.updateMany.mock.calls[0][0].where.id.in).toEqual([
        'session-1',
        'session-2',
      ]);
    });
  });
});
