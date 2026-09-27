/**
 * Environment contract of the API — the ONLY module that reads `process.env`.
 *
 * Everything downstream receives a validated, typed `ApiEnv`, so a malformed or
 * missing variable fails at boot with an actionable message instead of surfacing
 * as `undefined` deep inside a request.
 *
 * `loadEnv` is pure (the source is injectable) and therefore unit-testable
 * without touching the real environment.
 *
 * Deliberately not using @nestjs/config: the validation below is the single
 * source of truth, `.env` files are loaded natively by Node
 * (`--env-file-if-exists`, used by the dev/start scripts), and no module needs a
 * string-keyed config service when it can inject a typed object.
 */

export const NODE_ENVS = ['development', 'test', 'production'] as const;
export type NodeEnv = (typeof NODE_ENVS)[number];

export const LOG_LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

/** Shape of an environment source; `process.env` satisfies it. */
export type EnvSource = Record<string, string | undefined>;

export interface ApiEnv {
  nodeEnv: NodeEnv;
  port: number;
  /** Pooled Neon connection string. Undefined outside production until M2 seeds it. */
  databaseUrl: string | undefined;
  /** Redis connection string. Undefined disables the queue instead of breaking boot. */
  redisUrl: string | undefined;
  corsOrigins: string[];
  logLevel: LogLevel;
  /** Swagger is served in every environment except production, where it stays off. */
  swaggerEnabled: boolean;
}

export const DEFAULT_PORT = 4000;
export const DEFAULT_CORS_ORIGINS = ['http://localhost:3000'];

function parseEnum<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  variable: string,
  fallback: T,
): T {
  if (value === undefined || value.trim() === '') return fallback;

  if (!(allowed as readonly string[]).includes(value)) {
    throw new Error(`${variable} must be one of ${allowed.join(', ')} (received "${value}").`);
  }

  return value as T;
}

function parsePort(value: string | undefined): number {
  if (value === undefined || value.trim() === '') return DEFAULT_PORT;

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`PORT must be an integer between 1 and 65535 (received "${value}").`);
  }

  return port;
}

function parseList(value: string | undefined, fallback: readonly string[]): string[] {
  if (value === undefined || value.trim() === '') return [...fallback];

  const entries = value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  return entries.length > 0 ? entries : [...fallback];
}

function optionalUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function loadEnv(source: EnvSource = process.env): ApiEnv {
  const nodeEnv = parseEnum(source.NODE_ENV, NODE_ENVS, 'NODE_ENV', 'development');
  const port = parsePort(source.PORT);
  const databaseUrl = optionalUrl(source.DATABASE_URL);
  const redisUrl = optionalUrl(source.REDIS_URL);

  // Development and test may run without a database so that `pnpm dev` works on a
  // fresh clone. Production must never start without a connection string.
  if (nodeEnv === 'production' && databaseUrl === undefined) {
    throw new Error(
      'DATABASE_URL is required in production. Use the Neon POOLED connection string (see .env.example).',
    );
  }

  // Quiet by default in tests, chatty in development, steady in production.
  const logLevel = parseEnum(
    source.LOG_LEVEL,
    LOG_LEVELS,
    'LOG_LEVEL',
    nodeEnv === 'development' ? 'debug' : nodeEnv === 'test' ? 'silent' : 'info',
  );

  const swaggerEnabled =
    source.SWAGGER_ENABLED === undefined
      ? nodeEnv !== 'production'
      : source.SWAGGER_ENABLED.trim().toLowerCase() === 'true';

  return {
    nodeEnv,
    port,
    databaseUrl,
    redisUrl,
    corsOrigins: parseList(source.CORS_ORIGINS, DEFAULT_CORS_ORIGINS),
    logLevel,
    swaggerEnabled,
  };
}
