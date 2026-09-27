import { describe, expect, it } from 'vitest';

import { DEFAULT_PORT, DEFAULT_REDIS_URL, loadEnv } from './env.js';

describe('loadEnv defaults', () => {
  it('works on a fresh clone with no environment at all', () => {
    expect(loadEnv({})).toEqual({
      nodeEnv: 'development',
      port: DEFAULT_PORT,
      databaseUrl: undefined,
      redisUrl: DEFAULT_REDIS_URL,
    });
  });

  it('treats empty and whitespace-only values as unset', () => {
    const env = loadEnv({ NODE_ENV: '', PORT: '  ', DATABASE_URL: '   ', REDIS_URL: ' ' });

    expect(env.nodeEnv).toBe('development');
    expect(env.port).toBe(DEFAULT_PORT);
    expect(env.databaseUrl).toBeUndefined();
    expect(env.redisUrl).toBe(DEFAULT_REDIS_URL);
  });

  it('reads explicit values', () => {
    const env = loadEnv({
      NODE_ENV: 'test',
      PORT: '4321',
      DATABASE_URL: ' postgresql://pooler/db ',
      REDIS_URL: 'redis://cache:6379',
    });

    expect(env).toEqual({
      nodeEnv: 'test',
      port: 4321,
      // Trimmed, so a trailing space pasted from the Neon console cannot break it.
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
    expect(() => loadEnv({ NODE_ENV: 'production' })).toThrow(/DATABASE_URL is required in production/);
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
