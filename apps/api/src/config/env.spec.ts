import { DEFAULT_CORS_ORIGINS, DEFAULT_PORT, loadEnv } from './env.js';

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
    expect(loadEnv({ NODE_ENV: 'production', DATABASE_URL: 'postgresql://x' }).logLevel).toBe('info');
  });

  it('honours an explicit log level and rejects an unknown one', () => {
    expect(loadEnv({ LOG_LEVEL: 'trace' }).logLevel).toBe('trace');
    expect(() => loadEnv({ LOG_LEVEL: 'verbose' })).toThrow(/LOG_LEVEL must be one of/);
  });

  it('serves Swagger everywhere except production', () => {
    expect(loadEnv({ NODE_ENV: 'development' }).swaggerEnabled).toBe(true);
    expect(loadEnv({ NODE_ENV: 'production', DATABASE_URL: 'postgresql://x' }).swaggerEnabled).toBe(
      false,
    );
  });

  it('allows Swagger to be forced on or off explicitly', () => {
    expect(
      loadEnv({ NODE_ENV: 'production', DATABASE_URL: 'postgresql://x', SWAGGER_ENABLED: 'TRUE' })
        .swaggerEnabled,
    ).toBe(true);
    expect(loadEnv({ SWAGGER_ENABLED: 'false' }).swaggerEnabled).toBe(false);
  });
});
