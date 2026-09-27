import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

import type { ErrorResponseBody } from '../errors/error-response.js';
import type { RequestWithId } from '../http/request-id.js';
import { translateException } from './translate-exception.js';

/**
 * The single exit point for every failure.
 *
 * Guarantees that a client always receives the documented envelope
 * (`{ code, message, details?, requestId, path, timestamp }`) with a stable,
 * machine-readable `code` — the contract `@chapfoody/api-client` is built on.
 *
 * Two safety properties matter here:
 *   1. Unexpected failures are logged with their stack but answered with a generic
 *      message, so nothing internal leaks.
 *   2. If the response has already started (streaming, SSE), we do not attempt a
 *      second write; we close the stream instead.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      // Non-HTTP transports (future microservice/queue contexts) get their own filter.
      this.logger.error('Exception raised outside an HTTP context', exception as Error);
      return;
    }

    const context = host.switchToHttp();
    const request = context.getRequest<RequestWithId>();
    const response = context.getResponse<Response>();

    const translated = translateException(exception);
    const requestId = request.requestId;

    if (translated.isUnexpected) {
      this.logger.error(
        `Unhandled ${translated.status} on ${request.method} ${request.url} [requestId=${requestId ?? 'none'}]`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ErrorResponseBody = {
      code: translated.code,
      message: translated.message,
      ...(translated.details === undefined ? {} : { details: translated.details }),
      ...(requestId === undefined ? {} : { requestId }),
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (response.headersSent) {
      response.end();
      return;
    }

    // Some HttpExceptions carry headers we must preserve (WWW-Authenticate, Retry-After…).
    if (exception instanceof HttpException) {
      const headers = exception.getResponse();
      if (typeof headers === 'object' && headers !== null) {
        const record = headers as Record<string, unknown>;
        for (const [key, value] of Object.entries(record)) {
          if (key.startsWith('x-') || key === 'retry-after') {
            response.setHeader(key, String(value));
          }
        }
      }
    }

    response.status(translated.status).json(body);
  }
}
