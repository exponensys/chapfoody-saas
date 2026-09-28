import { DEV_ACCESS_SECRET, DEV_REFRESH_SECRET, type ApiEnv } from '../../src/config/env.js';

/**
 * A complete `ApiEnv` for tests.
 *
 * ── Why this exists ──────────────────────────────────────────────────────────
 * `ApiEnv` gained a required `auth` block in M3, which broke every spec that had built one by hand —
 * three files, each of which would break again the next time a required field is added. This factory
 * turns that into a one-line change in one place, and it lets each test state only what it is actually
 * varying.
 *
 * The defaults are deliberately the TEST environment's: silent logging, no database, no Redis, and the
 * development signing keys — which are unusable in production by construction, so a test can never
 * accidentally exercise a production configuration it did not ask for.
 */
export function makeTestEnv(overrides: Partial<ApiEnv> = {}): ApiEnv {
  return {
    nodeEnv: 'test',
    port: 4000,
    databaseUrl: undefined,
    redisUrl: undefined,
    corsOrigins: [],
    frontendUrl: 'http://localhost:3000',
    logLevel: 'silent',
    swaggerEnabled: false,
    auth: {
      accessSecret: DEV_ACCESS_SECRET,
      refreshSecret: DEV_REFRESH_SECRET,
      accessTtlSeconds: 900,
      refreshTtlSeconds: 2_592_000,
      cookie: { name: 'cf_refresh', secure: false, sameSite: 'lax', domain: undefined },
      lockout: { maxFailedAttempts: 10, durationSeconds: 900 },
      mfa: { issuer: 'Chapfoody', encryptionKey: 'dev-only-mfa-encryption-key-for-tests' },
      google: { clientId: undefined, clientSecret: undefined, redirectUri: undefined },
    },
    ...overrides,
  };
}
