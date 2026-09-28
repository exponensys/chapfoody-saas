import { DEFAULT_CORS_ORIGINS, DEFAULT_PORT, loadEnv } from './env.js';

/**
 * The minimum a production environment needs beyond DATABASE_URL.
 *
 * Since M3 the API refuses to boot in production without two distinct, sufficiently long signing
 * secrets: a development default that reached production would let anybody mint a token for anybody,
 * and it is exactly the kind of mistake that looks fine in a diff. These tests therefore have to
 * provide them — which is the requirement making itself visible rather than a detail of the tests.
 */
const PRODUCTION_SECRETS = {
  JWT_ACCESS_SECRET: 'a'.repeat(40),
  JWT_REFRESH_SECRET: 'b'.repeat(40),
  // The MFA secret box key is required in production too: a development placeholder reaching a
  // deployment would encrypt every enrolled TOTP secret under a key published in this repository.
  MFA_ENCRYPTION_KEY: 'c'.repeat(40),
} as const;

describe('loadEnv defaults', () => {
  it('boots on a fresh clone with no environment at all', () => {
    expect(loadEnv({})).toEqual({
      nodeEnv: 'development',
      port: DEFAULT_PORT,
      databaseUrl: undefined,
      redisUrl: undefined,
      corsOrigins: DEFAULT_CORS_ORIGINS,
      logLevel: 'debug',
      swaggerEnabled: true,
      // Asserted by shape rather than by value: the authentication block has its own suite
      // (auth-env.spec.ts), and duplicating it here would mean two places to update and one of them
      // forgotten. `objectContaining` still catches an unexpected TOP-LEVEL field, which is what this
      // assertion is for.
      auth: expect.objectContaining({
        accessTtlSeconds: 900,
        refreshTtlSeconds: 2_592_000,
      }),
    });
  });

  it('treats empty and whitespace-only values as unset', () => {
    const env = loadEnv({
      NODE_ENV: '',
      PORT: '  ',
      DATABASE_URL: '   ',
      REDIS_URL: ' ',
      LOG_LEVEL: '',
    });

    expect(env.nodeEnv).toBe('development');
    expect(env.port).toBe(DEFAULT_PORT);
    expect(env.databaseUrl).toBeUndefined();
    expect(env.redisUrl).toBeUndefined();
    expect(env.logLevel).toBe('debug');
  });

  it('reads explicit values, trimming the URLs', () => {
    const env = loadEnv({
      NODE_ENV: 'test',
      PORT: '4321',
      DATABASE_URL: ' postgresql://pooler/db ',
      REDIS_URL: ' redis://cache:6379 ',
    });

    expect(env).toMatchObject({
      nodeEnv: 'test',
      port: 4321,
      databaseUrl: 'postgresql://pooler/db',
      redisUrl: 'redis://cache:6379',
    });
  });
});

describe('loadEnv validation', () => {
  it('rejects an unknown NODE_ENV and lists the accepted values', () => {
    expect(() => loadEnv({ NODE_ENV: 'staging' })).toThrow(/NODE_ENV must be one of/);
  });

  it.each(['abc', '0', '-1', '70000', '4000.5'])('rejects PORT="%s"', (port) => {
    expect(() => loadEnv({ PORT: port })).toThrow(/PORT must be an integer/);
  });

  it('accepts the boundary ports', () => {
    expect(loadEnv({ PORT: '1' }).port).toBe(1);
    expect(loadEnv({ PORT: '65535' }).port).toBe(65535);
  });

  it('refuses to boot in production without a database URL', () => {
    expect(() => loadEnv({ NODE_ENV: 'production' })).toThrow(
      /DATABASE_URL is required in production/,
    );
  });

  it('boots in production once the pooled connection string is provided', () => {
    const env = loadEnv({
      NODE_ENV: 'production',
      DATABASE_URL: 'postgresql://user:pw@ep-x-pooler.eu-central-1.aws.neon.tech/chapfoody',
      ...PRODUCTION_SECRETS,
    });

    expect(env.nodeEnv).toBe('production');
    expect(env.databaseUrl).toContain('-pooler');
  });
});

describe('loadEnv derived settings', () => {
  it('parses CORS_ORIGINS as a trimmed list', () => {
    expect(loadEnv({ CORS_ORIGINS: 'http://a.test , http://b.test,' }).corsOrigins).toEqual([
      'http://a.test',
      'http://b.test',
    ]);
  });

  it('falls back to the default origins when the list is empty', () => {
    expect(loadEnv({ CORS_ORIGINS: ' , ' }).corsOrigins).toEqual(DEFAULT_CORS_ORIGINS);
  });

  it('picks a log level per environment', () => {
    expect(loadEnv({ NODE_ENV: 'development' }).logLevel).toBe('debug');
    expect(loadEnv({ NODE_ENV: 'test' }).logLevel).toBe('silent');
    expect(
      loadEnv({ NODE_ENV: 'production', DATABASE_URL: 'postgresql://x', ...PRODUCTION_SECRETS })
        .logLevel,
    ).toBe('info');
  });

  it('honours an explicit log level and rejects an unknown one', () => {
    expect(loadEnv({ LOG_LEVEL: 'trace' }).logLevel).toBe('trace');
    expect(() => loadEnv({ LOG_LEVEL: 'verbose' })).toThrow(/LOG_LEVEL must be one of/);
  });

  it('serves Swagger everywhere except production', () => {
    expect(loadEnv({ NODE_ENV: 'development' }).swaggerEnabled).toBe(true);
    expect(
      loadEnv({ NODE_ENV: 'production', DATABASE_URL: 'postgresql://x', ...PRODUCTION_SECRETS })
        .swaggerEnabled,
    ).toBe(false);
  });

  it('allows Swagger to be forced on or off explicitly', () => {
    expect(
      loadEnv({
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://x',
        SWAGGER_ENABLED: 'TRUE',
        ...PRODUCTION_SECRETS,
      }).swaggerEnabled,
    ).toBe(true);
    expect(loadEnv({ SWAGGER_ENABLED: 'false' }).swaggerEnabled).toBe(false);
  });
});
