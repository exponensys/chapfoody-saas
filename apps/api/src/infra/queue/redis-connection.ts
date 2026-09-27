import type { ConnectionOptions } from 'bullmq';

/**
 * Turns a Redis URL into explicit connection options.
 *
 * Why not pass `{ url }` straight through: neither ioredis nor BullMQ documents a
 * `url` key in their option objects, so relying on it would be guesswork that
 * happens to work until it does not. Parsing here is explicit, unit-testable, and
 * makes the TLS and authentication cases visible instead of implicit.
 *
 * Supports the URL shapes we actually deploy:
 *   redis://localhost:6379
 *   redis://:password@host:6379/2
 *   redis://user:password@host:6379
 *   rediss://default:password@host:6379        (Upstash and other managed TLS)
 */
export function buildRedisConnection(redisUrl: string): ConnectionOptions {
  const url = new URL(redisUrl);

  if (url.protocol !== 'redis:' && url.protocol !== 'rediss:') {
    throw new Error(
      `REDIS_URL must use the redis:// or rediss:// scheme (received "${url.protocol}//").`,
    );
  }

  const database = url.pathname.replace(/^\//, '');

  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 6379,
    ...(url.username ? { username: decodeURIComponent(url.username) } : {}),
    ...(url.password ? { password: decodeURIComponent(url.password) } : {}),
    ...(database ? { db: Number(database) } : {}),
    ...(url.protocol === 'rediss:' ? { tls: {} } : {}),

    /**
     * BullMQ requires this to be `null` on connections that issue blocking
     * commands (workers). ioredis's default of 20 would make a worker throw the
     * moment it idles.
     */
    maxRetriesPerRequest: null,
  };
}
