import { buildRedisConnection } from './redis-connection.js';

describe('buildRedisConnection', () => {
  it('always sets maxRetriesPerRequest to null', () => {
    // BullMQ workers issue blocking commands; ioredis's default of 20 makes them
    // throw the moment a worker idles, so this is not optional.
    // Asserted with toMatchObject because ConnectionOptions is a union that also
    // covers cluster options, which do not declare this property.
    expect(buildRedisConnection('redis://localhost:6379')).toMatchObject({
      maxRetriesPerRequest: null,
    });
    expect(buildRedisConnection('rediss://user:pw@host:6380')).toMatchObject({
      maxRetriesPerRequest: null,
    });
  });

  it('parses a plain local URL', () => {
    expect(buildRedisConnection('redis://localhost:6379')).toEqual({
      host: 'localhost',
      port: 6379,
      maxRetriesPerRequest: null,
    });
  });

  it('defaults the port to 6379 when it is omitted', () => {
    expect(buildRedisConnection('redis://cache.internal')).toMatchObject({ port: 6379 });
  });

  it('parses a password-only URL, as produced by most managed Redis offerings', () => {
    expect(buildRedisConnection('redis://:s3cret@cache.example.com:6380')).toMatchObject({
      host: 'cache.example.com',
      port: 6380,
      password: 's3cret',
    });
  });

  it('parses a username and a password', () => {
    expect(buildRedisConnection('redis://default:pw@host:6379')).toMatchObject({
      username: 'default',
      password: 'pw',
    });
  });

  it('decodes percent-encoded credentials', () => {
    // Passwords with @ : / must be encoded in the URL; they must arrive intact.
    expect(buildRedisConnection('redis://user:p%40ss%3Aword@host:6379')).toMatchObject({
      password: 'p@ss:word',
    });
  });

  it('parses a database index from the path', () => {
    expect(buildRedisConnection('redis://host:6379/3')).toMatchObject({ db: 3 });
    expect(buildRedisConnection('redis://host:6379/')).not.toHaveProperty('db');
  });

  it('enables TLS for rediss:// so managed providers work unchanged', () => {
    expect(buildRedisConnection('rediss://user:pw@host:6380')).toMatchObject({ tls: {} });
    expect(buildRedisConnection('redis://host:6379')).not.toHaveProperty('tls');
  });

  it.each(['postgresql://host:5432/db', 'http://host:6379', 'amqp://host'])(
    'rejects the non-Redis scheme in "%s" with an actionable message',
    (url) => {
      expect(() => buildRedisConnection(url)).toThrow(/REDIS_URL must use the redis:\/\/ or rediss:\/\//);
    },
  );
});
