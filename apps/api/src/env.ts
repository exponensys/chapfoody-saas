/**
 * Environment contract of the API.
 *
 * Reads `process.env` in exactly one place, validates it eagerly and returns a
 * typed object. Everything downstream takes an `ApiEnv`, so a missing or
 * malformed variable fails at boot with an actionable message instead of
 * surfacing as `undefined` somewhere deep in a request.
 *
 * M0 scope: NODE_ENV, PORT, DATABASE_URL, REDIS_URL.
 * M1 replaces this module with the NestJS typed ConfigModule, keeping the same
 * fail-fast behaviour.
 */

export type NodeEnv = 'development' | 'test' | 'production';

export interface ApiEnv {
  nodeEnv: NodeEnv;
  port: number;
  /** Pooled Neon connection string. Undefined outside production (M2 uses it). */
  databaseUrl: string | undefined;
  redisUrl: string;
}

export const DEFAULT_PORT = 4000;
export const DEFAULT_REDIS_URL = 'redis://127.0.0.1:6379';

const NODE_ENVS: readonly NodeEnv[] = ['development', 'test', 'production'];

function parseNodeEnv(raw: string | undefined): NodeEnv {
  if (raw === undefined || raw.trim() === '') return 'development';

  if ((NODE_ENVS as readonly string[]).includes(raw)) return raw as NodeEnv;

  throw new Error(
    `loadEnv: NODE_ENV must be one of ${NODE_ENVS.join(', ')} (received "${raw}").`,
  );
}

function parsePort(raw: string | undefined): number {
  if (raw === undefined || raw.trim() === '') return DEFAULT_PORT;

  const port = Number(raw);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`loadEnv: PORT must be an integer between 1 and 65535 (received "${raw}").`);
  }

  return port;
}

export function loadEnv(source: Record<string, string | undefined> = process.env): ApiEnv {
  const nodeEnv = parseNodeEnv(source.NODE_ENV);
  const port = parsePort(source.PORT);
  const databaseUrl = source.DATABASE_URL?.trim() || undefined;

  // Development and test may run without a database so that `pnpm dev` works on a
  // fresh clone. Production must never start without a connection string.
  if (nodeEnv === 'production' && databaseUrl === undefined) {
    throw new Error(
      "loadEnv: DATABASE_URL is required in production. Use the Neon POOLED connection string (see .env.example).",
    );
  }

  return {
    nodeEnv,
    port,
    databaseUrl,
    redisUrl: source.REDIS_URL?.trim() || DEFAULT_REDIS_URL,
  };
}
