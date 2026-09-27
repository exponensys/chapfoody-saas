import { randomUUID } from 'node:crypto';

import type { Request } from 'express';

/**
 * An Express request carrying the correlation id assigned by `requestIdMiddleware`.
 *
 * Declared explicitly instead of augmenting the global Express namespace: module
 * augmentation of `express-serve-static-core` is version-sensitive (it silently
 * stops applying when `@types/express` reshuffles its dependencies), and an
 * explicit interface makes the contract visible at every use site.
 */
export interface RequestWithId extends Request {
  requestId?: string;
}

/**
 * Request correlation ids.
 *
 * The value is echoed in the `x-request-id` response header, attached to every
 * log line and included in the error envelope, so a user-reported failure can be
 * traced to its exact server-side log entry.
 */
export const REQUEST_ID_HEADER = 'x-request-id';

/** Longest id we accept from a client. Anything longer is ignored, not truncated. */
const MAX_INCOMING_LENGTH = 128;

/**
 * Conservative allow-list. An arbitrary client-supplied string would otherwise be
 * written into logs and response headers, which allows log forging (embedded
 * newlines, ANSI escapes) and header bloat. We accept opaque ids — UUIDs,
 * OpenTelemetry trace ids, load-balancer ids — and nothing else.
 */
const SAFE_REQUEST_ID = /^[A-Za-z0-9._~-]+$/;

/**
 * Returns the client's correlation id when it is safe to reuse, otherwise a fresh
 * UUID. Pure and injectable, so it is unit-tested without HTTP.
 */
export function resolveRequestId(incoming?: string | string[] | undefined): string {
  const candidate = Array.isArray(incoming) ? incoming[0] : incoming;

  if (
    typeof candidate === 'string' &&
    candidate.length > 0 &&
    candidate.length <= MAX_INCOMING_LENGTH &&
    SAFE_REQUEST_ID.test(candidate)
  ) {
    return candidate;
  }

  return randomUUID();
}
