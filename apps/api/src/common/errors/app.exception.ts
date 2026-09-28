import { HttpException, HttpStatus } from '@nestjs/common';

import { ERROR_CODES } from './error-codes.js';

/**
 * An exception that carries a stable machine-readable `code` alongside its HTTP
 * status, so the frontend can react precisely instead of parsing a message.
 *
 * The global exception filter serialises it straight into the error envelope that
 * `@chapfoody/api-client` expects.
 */
export class AppException extends HttpException {
  readonly code: string;
  readonly details?: unknown;

  constructor(
    status: HttpStatus | number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message, status);
    this.name = 'AppException';
    this.code = code;
    this.details = details;
  }

  /** 404 — the resource does not exist, or does not exist *for this tenant*. */
  static notFound(message: string, details?: unknown): AppException {
    return new AppException(HttpStatus.NOT_FOUND, ERROR_CODES.NOT_FOUND, message, details);
  }

  /**
   * 401 — no valid credentials, or credentials that no longer work.
   *
   * Deliberately one code for "wrong password", "expired token" and "revoked session": the caller
   * learns that they are not signed in and nothing more. Distinguishing them would tell an attacker
   * which half of a guess was right.
   */
  static unauthenticated(message: string, details?: unknown): AppException {
    return new AppException(HttpStatus.UNAUTHORIZED, ERROR_CODES.UNAUTHENTICATED, message, details);
  }

  /** 403 — authenticated, and not allowed. */
  static forbidden(message: string, details?: unknown): AppException {
    return new AppException(HttpStatus.FORBIDDEN, ERROR_CODES.FORBIDDEN, message, details);
  }

  /**
   * 503 — a dependency is unavailable.
   * Used by the health probes when the database or the queue cannot be reached.
   */
  static serviceUnavailable(message: string, details?: unknown): AppException {
    return new AppException(
      HttpStatus.SERVICE_UNAVAILABLE,
      ERROR_CODES.SERVICE_UNAVAILABLE,
      message,
      details,
    );
  }
}
