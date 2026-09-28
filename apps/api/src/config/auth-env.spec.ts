import { DEFAULT_MAX_FAILED_ATTEMPTS, DEV_ACCESS_SECRET, loadEnv } from './env.js';

/**
 * The authentication half of the environment contract.
 *
 * These assertions are all about configuration mistakes that look harmless in a diff: a default
 * signing key surviving into production, two secrets copy-pasted into both variables, a refresh
 * lifetime shorter than the access lifetime. Each produces a system that works on a laptop and fails
 * in a way that is hard to attribute once deployed.
 */
describe('loadEnv — authentication', () => {
  it('falls back to development placeholders outside production', () => {
    const env = loadEnv({ NODE_ENV: 'development' });

    expect(env.auth.accessSecret).toBe(DEV_ACCESS_SECRET);
    expect(env.auth.refreshSecret).not.toBe(env.auth.accessSecret);
  });

  it('uses the documented defaults for lifetimes and the cookie', () => {
    const env = loadEnv({ NODE_ENV: 'development' });

    expect(env.auth.accessTtlSeconds).toBe(900); // 15m
    expect(env.auth.refreshTtlSeconds).toBe(2_592_000); // 30d
    expect(env.auth.cookie.name).toBe('cf_refresh');
    expect(env.auth.cookie.sameSite).toBe('lax');
    expect(env.auth.mfa.issuer).toBe('Chapfoody');
    expect(env.auth.lockout.maxFailedAttempts).toBe(DEFAULT_MAX_FAILED_ATTEMPTS);
  });

  it('reads the configured durations rather than the defaults', () => {
    const env = loadEnv({
      NODE_ENV: 'development',
      ACCESS_TOKEN_TTL: '5m',
      REFRESH_TOKEN_TTL: '7d',
    });

    expect(env.auth.accessTtlSeconds).toBe(300);
    expect(env.auth.refreshTtlSeconds).toBe(604_800);
  });

  // ── Production is the environment where a mistake is expensive ───────────────

  it('refuses to start in production without signing secrets', () => {
    expect(() => loadEnv({ NODE_ENV: 'production', DATABASE_URL: 'postgres://x' })).toThrow(
      /JWT_ACCESS_SECRET is required in production/,
    );
  });

  it('refuses a production secret that is too short', () => {
    expect(() =>
      loadEnv({
        NODE_ENV: 'production',
        DATABASE_URL: 'postgres://x',
        JWT_ACCESS_SECRET: 'too-short',
        JWT_REFRESH_SECRET: 'also-too-short',
      }),
    ).toThrow(/JWT_ACCESS_SECRET must be at least 32 characters/);
  });

  it('refuses the SAME secret in both variables', () => {
    // The tempting shortcut when generating one key: reuse it. It silently removes the reason the
    // refresh hash is keyed at all.
    const secret = 'a'.repeat(40);

    expect(() =>
      loadEnv({
        NODE_ENV: 'production',
        DATABASE_URL: 'postgres://x',
        JWT_ACCESS_SECRET: secret,
        JWT_REFRESH_SECRET: secret,
      }),
    ).toThrow(/must differ/);
  });

  it('starts in production with two distinct long secrets', () => {
    const env = loadEnv({
      NODE_ENV: 'production',
      DATABASE_URL: 'postgres://x',
      JWT_ACCESS_SECRET: 'a'.repeat(40),
      JWT_REFRESH_SECRET: 'b'.repeat(40),
    });

    expect(env.auth.accessSecret).toBe('a'.repeat(40));
    // Secure by default in production, so a deployment cannot forget it.
    expect(env.auth.cookie.secure).toBe(true);
  });

  it('refuses a refresh lifetime no longer than the access lifetime', () => {
    // Presents as intermittent logout rather than as a configuration error, which is why it is caught
    // at boot instead of being left to whoever notices first.
    expect(() =>
      loadEnv({ NODE_ENV: 'development', ACCESS_TOKEN_TTL: '30d', REFRESH_TOKEN_TTL: '15m' }),
    ).toThrow(/must be longer than ACCESS_TOKEN_TTL/);

    expect(() =>
      loadEnv({ NODE_ENV: 'development', ACCESS_TOKEN_TTL: '1h', REFRESH_TOKEN_TTL: '60m' }),
    ).toThrow(/must be longer than ACCESS_TOKEN_TTL/);
  });
});
