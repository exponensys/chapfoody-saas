/**
 * Stable machine-readable error codes.
 *
 * These strings are part of the public contract: `@chapfoody/api-client` ships
 * `ApiError` predicates that branch on them (for example
 * `isFeatureNotInSubscription` for requirement B.13). Adding a code is a
 * non-breaking change; renaming or removing one is a breaking change and needs a
 * version bump of the API.
 *
 * Values are SCREAMING_SNAKE_CASE and intentionally identical to the keys.
 */
export const ERROR_CODES = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  CONFLICT: 'CONFLICT',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',
  RATE_LIMITED: 'RATE_LIMITED',
  FEATURE_NOT_IN_SUBSCRIPTION: 'FEATURE_NOT_IN_SUBSCRIPTION',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * Fallback mapping from an HTTP status to a stable code.
 *
 * Used when an exception carries a status but no explicit code — for instance a
 * framework-level 404 or 405 raised before any of our handlers runs.
 */
export function defaultCodeForStatus(status: number): ErrorCode {
  switch (status) {
    case 400:
      return ERROR_CODES.VALIDATION_FAILED;
    case 401:
      return ERROR_CODES.UNAUTHENTICATED;
    case 403:
      return ERROR_CODES.FORBIDDEN;
    case 404:
      return ERROR_CODES.NOT_FOUND;
    case 405:
      return ERROR_CODES.METHOD_NOT_ALLOWED;
    case 409:
      return ERROR_CODES.CONFLICT;
    case 413:
      return ERROR_CODES.PAYLOAD_TOO_LARGE;
    case 422:
      return ERROR_CODES.UNPROCESSABLE_ENTITY;
    case 429:
      return ERROR_CODES.RATE_LIMITED;
    case 503:
      return ERROR_CODES.SERVICE_UNAVAILABLE;
    default:
      return status >= 500 ? ERROR_CODES.INTERNAL_ERROR : ERROR_CODES.VALIDATION_FAILED;
  }
}
