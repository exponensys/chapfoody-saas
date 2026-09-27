/**
 * Error handling of the API client.
 *
 * The shape mirrors the global exception filter of the NestJS API (M1):
 *
 *   { "code": "FEATURE_NOT_IN_SUBSCRIPTION",
 *     "message": "…", "details": …, "requestId": "…" }
 *
 * Handling a typed `code` instead of parsing a message string is what lets the
 * frontend react precisely — for example showing the upgrade call to action when
 * a premium feature is refused (requirement B.13).
 */

/** Stable error envelope produced by the API. */
export interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
}

/** A non-2xx API response, carrying the server's stable error code. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;
  readonly requestId?: string;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.status = status;
    this.code = body.code;
    this.details = body.details;
    this.requestId = body.requestId;
  }

  /** True when the refusal comes from the subscription gate (requirement B.13). */
  get isFeatureNotInSubscription(): boolean {
    return this.code === 'FEATURE_NOT_IN_SUBSCRIPTION';
  }

  /** True when the session is missing or expired and the user must sign in again. */
  get isUnauthenticated(): boolean {
    return this.status === 401;
  }

  /** True when the caller is authenticated but not allowed (wrong role, wrong tenant). */
  get isForbidden(): boolean {
    return this.status === 403;
  }
}

/**
 * Normalises any non-2xx response into an `ApiErrorBody`.
 * Internal to the client, exported so it can be unit-tested directly.
 */
export async function readErrorBody(response: Response): Promise<ApiErrorBody> {
  try {
    const parsed = (await response.json()) as Partial<ApiErrorBody> | null;

    if (parsed && typeof parsed.message === 'string' && parsed.message.length > 0) {
      return {
        code: parsed.code ?? 'UNKNOWN_ERROR',
        message: parsed.message,
        details: parsed.details,
        requestId: parsed.requestId,
      };
    }
  } catch {
    // Not JSON (proxy error page, empty body, HTML…): fall through to the generic shape.
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: `Request failed with status ${response.status}`,
  };
}
