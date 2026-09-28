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

import { parseDurationSeconds } from './duration.js';

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
  /** Authentication: signing keys, session lifetimes, cookie policy, lockout, MFA, OAuth. */
  auth: AuthEnv;
}

export interface AuthEnv {
  /** JWT signing key for access tokens. */
  accessSecret: string;
  /**
   * HMAC key applied to a refresh token before it is stored.
   *
   * The token itself is 256 bits of randomness, so a bare SHA-256 would already be unguessable — but
   * keying the hash means a stolen database is not enough to verify a guessed token offline, and it
   * gives the declared `JWT_REFRESH_SECRET` a real job instead of leaving an unused secret in `.env`
   * that nobody dares delete.
   */
  refreshSecret: string;

  accessTtlSeconds: number;
  refreshTtlSeconds: number;

  cookie: {
    name: string;
    /** False on localhost over http, where a Secure cookie is simply never sent. */
    secure: boolean;
    sameSite: 'lax' | 'strict' | 'none';
    domain: string | undefined;
  };

  lockout: {
    maxFailedAttempts: number;
    durationSeconds: number;
  };

  mfa: {
    issuer: string;
    /** Encrypts the TOTP secret at rest. Required in production, where enrolment is attempted. */
    encryptionKey: string | undefined;
  };

  google: {
    clientId: string | undefined;
    clientSecret: string | undefined;
    redirectUri: string | undefined;
  };
}

/**
 * Development-only signing keys.
 *
 * Deliberately long enough to be usable by the JWT library and deliberately prefixed so that seeing
 * one in a log or a token is unmistakable. They cannot reach production: `loadEnv` refuses to start
 * there without explicitly provided secrets, so this is a convenience for `pnpm dev` and the test
 * suite rather than a default a deployment could inherit.
 */
export const DEV_ACCESS_SECRET = 'dev-only-access-secret-not-for-production-32+';
export const DEV_REFRESH_SECRET = 'dev-only-refresh-secret-not-for-production-32+';

/** Minimum length for a signing key in production. Below this, HMAC-SHA256 is the weak link. */
export const MIN_SECRET_LENGTH = 32;

export const DEFAULT_ACCESS_TTL = '15m';
export const DEFAULT_REFRESH_TTL = '30d';
export const DEFAULT_COOKIE_NAME = 'cf_refresh';
export const DEFAULT_MAX_FAILED_ATTEMPTS = 10;
export const DEFAULT_LOCKOUT_DURATION = '15m';
export const DEFAULT_MFA_ISSUER = 'Chapfoody';

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

/**
 * Parses and validates the authentication block.
 *
 * The rules that matter, and why each is here rather than left to a code review:
 *
 *  - **Production requires explicit, long, distinct secrets.** A default signing key that reaches
 *    production lets anybody mint a token for anybody; two secrets that are accidentally the same
 *    would make the refresh-keyed hash no stronger than the bare one. Both are configuration mistakes
 *    that look fine in a diff.
 *  - **The refresh lifetime must exceed the access lifetime.** A refresh token that expires first
 *    makes every session die at the refresh boundary, which presents as intermittent logout.
 *  - **`Secure` defaults from the environment.** Forcing it on would break localhost over http, where
 *    the browser never sends the cookie and login appears to succeed while nothing persists.
 */
function parseAuth(source: EnvSource, nodeEnv: NodeEnv): AuthEnv {
  const isProduction = nodeEnv === 'production';

  const providedAccess = optionalUrl(source.JWT_ACCESS_SECRET);
  const providedRefresh = optionalUrl(source.JWT_REFRESH_SECRET);

  if (isProduction) {
    for (const [value, variable] of [
      [providedAccess, 'JWT_ACCESS_SECRET'],
      [providedRefresh, 'JWT_REFRESH_SECRET'],
    ] as const) {
      if (value === undefined) {
        throw new Error(`${variable} is required in production. Generate one with: openssl rand -base64 48`);
      }

      if (value.length < MIN_SECRET_LENGTH) {
        throw new Error(
          `${variable} must be at least ${MIN_SECRET_LENGTH} characters in production (received ${value.length}).`,
        );
      }
    }

    if (providedAccess === providedRefresh) {
      throw new Error(
        'JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must differ: reusing one key for both means a leaked ' +
          'access key also forges refresh hashes.',
      );
    }
  }

  const accessSecret = providedAccess ?? DEV_ACCESS_SECRET;
  const refreshSecret = providedRefresh ?? DEV_REFRESH_SECRET;

  const accessTtlSeconds = parseDurationSeconds(
    source.ACCESS_TOKEN_TTL?.trim() || DEFAULT_ACCESS_TTL,
    'ACCESS_TOKEN_TTL',
  );
  const refreshTtlSeconds = parseDurationSeconds(
    source.REFRESH_TOKEN_TTL?.trim() || DEFAULT_REFRESH_TTL,
    'REFRESH_TOKEN_TTL',
  );

  if (refreshTtlSeconds <= accessTtlSeconds) {
    throw new Error(
      `REFRESH_TOKEN_TTL (${refreshTtlSeconds}s) must be longer than ACCESS_TOKEN_TTL ` +
        `(${accessTtlSeconds}s): otherwise every session ends at the first refresh, which looks ` +
        'like intermittent logout rather than a configuration error.',
    );
  }

  const sameSite = parseEnum(
    source.COOKIE_SAME_SITE,
    ['lax', 'strict', 'none'] as const,
    'COOKIE_SAME_SITE',
    'lax',
  );

  // SameSite=None is only honoured on a Secure cookie, and a cookie that is silently dropped is worse
  // than one that refuses to start: the failure appears as "login does nothing".
  if (sameSite === 'none' && source.COOKIE_SECURE?.trim().toLowerCase() === 'false') {
    throw new Error('COOKIE_SAME_SITE=none requires COOKIE_SECURE=true; browsers reject the combination.');
  }

  return {
    accessSecret,
    refreshSecret,
    accessTtlSeconds,
    refreshTtlSeconds,
    cookie: {
      name: optionalUrl(source.COOKIE_NAME) ?? DEFAULT_COOKIE_NAME,
      secure:
        source.COOKIE_SECURE === undefined
          ? isProduction
          : source.COOKIE_SECURE.trim().toLowerCase() === 'true',
      sameSite,
      domain: optionalUrl(source.COOKIE_DOMAIN),
    },
    lockout: {
      maxFailedAttempts: parsePositiveInt(
        source.MAX_FAILED_LOGIN_ATTEMPTS,
        'MAX_FAILED_LOGIN_ATTEMPTS',
        DEFAULT_MAX_FAILED_ATTEMPTS,
      ),
      durationSeconds: parseDurationSeconds(
        source.LOCKOUT_DURATION?.trim() || DEFAULT_LOCKOUT_DURATION,
        'LOCKOUT_DURATION',
      ),
    },
    mfa: {
      issuer: optionalUrl(source.MFA_ISSUER) ?? DEFAULT_MFA_ISSUER,
      encryptionKey: optionalUrl(source.MFA_ENCRYPTION_KEY),
    },
    google: {
      clientId: optionalUrl(source.GOOGLE_CLIENT_ID),
      clientSecret: optionalUrl(source.GOOGLE_CLIENT_SECRET),
      redirectUri: optionalUrl(source.GOOGLE_REDIRECT_URI),
    },
  };
}

function parsePositiveInt(value: string | undefined, variable: string, fallback: number): number {
  if (value === undefined || value.trim() === '') return fallback;

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${variable} must be a positive integer (received "${value}").`);
  }

  return parsed;
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
    auth: parseAuth(source, nodeEnv),
  };
}
