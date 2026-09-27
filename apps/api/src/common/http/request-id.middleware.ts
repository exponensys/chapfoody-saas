import type { NextFunction, Request, Response } from 'express';

import { REQUEST_ID_HEADER, resolveRequestId, type RequestWithId } from './request-id.js';

/**
 * Assigns a correlation id to every request and echoes it back in the response.
 *
 * Deliberately a plain Express middleware rather than a Nest `NestMiddleware`
 * class:
 *   - it needs no dependency injection, so a class would add ceremony with no gain;
 *   - `MiddlewareConsumer.forRoutes()` wildcard syntax changed in Nest 11 (the
 *     path-to-regexp upgrade), and `app.use()` sidesteps that entirely while also
 *     covering routes Nest does not own (the Swagger UI, for instance).
 *
 * Idempotent by design: if pino's `genReqId` ran first and already resolved the
 * id, it is reused instead of regenerated, so middleware ordering cannot change
 * the outcome.
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const request = req as RequestWithId;
  const requestId = request.requestId ?? resolveRequestId(request.headers[REQUEST_ID_HEADER]);

  request.requestId = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);

  next();
}
