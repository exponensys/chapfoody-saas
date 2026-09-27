/**
 * The error envelope returned by every failure (see the global exception filter).
 *
 * `@chapfoody/api-client` parses exactly this shape, so it is a cross-package
 * contract: `code` is what the frontend branches on, `message` is already
 * user-presentable, `details` carries field-level information, and `requestId`
 * ties the response to the server log line for support.
 */
export interface ErrorResponseBody {
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
  /** Request path, for locating the failure in logs and dashboards. */
  path?: string;
  /** ISO-8601, so a client can display or correlate it. */
  timestamp: string;
}

/** Field-level validation details: `{ email: ['Adresse e-mail invalide'] }`. */
export type ValidationErrorDetails = Record<string, string[]>;

/** Success payload of a health probe. */
export interface HealthResponseBody {
  status: 'ok' | 'degraded';
  service: string;
  milestone: string;
  uptimeSeconds: number;
  timestamp: string;
}

/** Payload of a single dependency probe (`/health/db`, `/health/queue`). */
export interface DependencyHealthResponseBody {
  status: 'up' | 'down' | 'disabled' | 'not-configured';
  dependency: 'database' | 'queue';
  latencyMs: number | null;
  message?: string;
  requestId?: string;
  timestamp: string;
}
