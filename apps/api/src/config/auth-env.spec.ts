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
        MFA_ENCRYPTION_KEY: 'c'.repeat(40),
      }),
    ).toThrow(/must differ/);
  });

  it('starts in production with two distinct long secrets', () => {
    const env = loadEnv({
      NODE_ENV: 'production',
      DATABASE_URL: 'postgres://x',
      JWT_ACCESS_SECRET: 'a'.repeat(40),
      JWT_REFRESH_SECRET: 'b'.repeat(40),
      MFA_ENCRYPTION_KEY: 'c'.repeat(40),
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

  // ── Cookie policy ───────────────────────────────────────────────────────────
  // These were drafted with the rest of the block and then never written down, which is worth being
  // plain about: the file was 99 lines and its cookie, lockout and MFA assertions did not exist.

  it('is not Secure outside production, because localhost is http', () => {
    // Forcing Secure on would mean the browser never sends the cookie in development: login would
    // appear to succeed and nothing would persist.
    expect(loadEnv({ NODE_ENV: 'development' }).auth.cookie.secure).toBe(false);
    expect(loadEnv({ NODE_ENV: 'test' }).auth.cookie.secure).toBe(false);
  });

  it('refuses SameSite=None without Secure, which browsers reject anyway', () => {
    expect(() =>
      loadEnv({ NODE_ENV: 'development', COOKIE_SAME_SITE: 'none', COOKIE_SECURE: 'false' }),
    ).toThrow(/requires COOKIE_SECURE=true/);
  });

  it('accepts SameSite=None when the cookie is Secure', () => {
    const env = loadEnv({ NODE_ENV: 'development', COOKIE_SAME_SITE: 'none', COOKIE_SECURE: 'true' });

    expect(env.auth.cookie.sameSite).toBe('none');
  });

  it('refuses an unknown SameSite value', () => {
    expect(() => loadEnv({ NODE_ENV: 'development', COOKIE_SAME_SITE: 'sometimes' })).toThrow(
      /COOKIE_SAME_SITE must be one of/,
    );
  });

  it('reads the cookie name and domain when they are set', () => {
    const env = loadEnv({
      NODE_ENV: 'development',
      COOKIE_NAME: 'custom_refresh',
      COOKIE_DOMAIN: '.chapfoody.test',
    });

    expect(env.auth.cookie.name).toBe('custom_refresh');
    expect(env.auth.cookie.domain).toBe('.chapfoody.test');
  });

  // ── Lockout ─────────────────────────────────────────────────────────────────

  it('reads the lockout policy', () => {
    const env = loadEnv({
      NODE_ENV: 'development',
      MAX_FAILED_LOGIN_ATTEMPTS: '3',
      LOCKOUT_DURATION: '1h',
    });

    expect(env.auth.lockout.maxFailedAttempts).toBe(3);
    expect(env.auth.lockout.durationSeconds).toBe(3_600);
  });

  it('refuses a non-positive attempt count', () => {
    expect(() => loadEnv({ NODE_ENV: 'development', MAX_FAILED_LOGIN_ATTEMPTS: '0' })).toThrow(
      /must be a positive integer/,
    );
    expect(() => loadEnv({ NODE_ENV: 'development', MAX_FAILED_LOGIN_ATTEMPTS: 'lots' })).toThrow(
      /must be a positive integer/,
    );
  });

  it('reads the OAuth settings when they are present', () => {
    const env = loadEnv({
      NODE_ENV: 'development',
      GOOGLE_CLIENT_ID: 'client-id',
      GOOGLE_CLIENT_SECRET: 'client-secret',
      GOOGLE_REDIRECT_URI: 'http://localhost:4000/v1/auth/google/callback',
    });

    expect(env.auth.google).toEqual({
      clientId: 'client-id',
      clientSecret: 'client-secret',
      redirectUri: 'http://localhost:4000/v1/auth/google/callback',
    });
  });

  it('falls back to a development key for the MFA secret box, and requires one in production', () => {
    // A dev key reaching a deployment would encrypt every enrolled TOTP secret under a value published
    // in this repository, so production must supply its own.
    expect(loadEnv({ NODE_ENV: 'development' }).auth.mfa.encryptionKey).toMatch(/^dev-only-/);

    expect(() =>
      loadEnv({
        NODE_ENV: 'production',
        DATABASE_URL: 'postgres://x',
        JWT_ACCESS_SECRET: 'a'.repeat(40),
        JWT_REFRESH_SECRET: 'b'.repeat(40),
      }),
    ).toThrow(/MFA_ENCRYPTION_KEY is required in production/);
  });
});
