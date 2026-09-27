import type { DynamicModule } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Options } from 'pino-http';

import { CURRENT_MILESTONE, SERVICE_NAME } from '../../app.constants.js';
import type { ApiEnv } from '../../config/env.js';
import { REQUEST_ID_HEADER, resolveRequestId } from '../http/request-id.js';

/**
 * Builds the pino-http options.
 *
 * Extracted from the module factory so the logging policy is a plain function of
 * the environment: reviewable in one screen, and testable without booting a Nest
 * application. Policy decisions worth naming:
 *
 *   - JSON in production (one line per event, ready for an aggregator), colourised
 *     in development only;
 *   - every record carries the service name, the milestone and the request id, so a
 *     client-reported failure can be found from the `requestId` in the error
 *     envelope alone;
 *   - credentials are redacted, never merely "not logged on purpose";
 *   - container probes are excluded from the access log, or they would bury real
 *     traffic.
 */
export function buildPinoHttpOptions(env: ApiEnv): Options {
  return {
    level: env.logLevel,

    /**
     * Correlation id. Idempotent with `requestIdMiddleware`: whichever runs first
     * resolves the id and stores it on the request, the other reuses it, so the
     * ordering of the two cannot change the outcome.
     */
    genReqId: (req: IncomingMessage, res: ServerResponse) => {
      const request = req as IncomingMessage & { requestId?: string };
      const requestId = request.requestId ?? resolveRequestId(req.headers[REQUEST_ID_HEADER]);

      request.requestId = requestId;
      res.setHeader(REQUEST_ID_HEADER, requestId);

      return requestId;
    },

    customProps: () => ({ service: SERVICE_NAME, milestone: CURRENT_MILESTONE }),

    // Secrets and credentials must never be written to a log line.
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'res.headers["set-cookie"]',
        'req.body.password',
        'req.body.token',
      ],
      remove: true,
    },

    // Container probes hit /health constantly; logging them would bury real traffic.
    autoLogging: {
      ignore: (req: IncomingMessage) =>
        req.url === '/health' || req.url?.startsWith('/health/') === true,
    },

    // `pino-pretty` is a devDependency and is only referenced when
    // NODE_ENV=development, which is never the case in a production image.
    transport:
      env.nodeEnv === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              singleLine: true,
              translateTime: 'HH:MM:ss.l',
              colorize: true,
              ignore: 'pid,hostname,service,milestone',
            },
          }
        : undefined,
  };
}

/** Structured logging module, configured from the validated environment. */
export function createLoggerModule(env: ApiEnv): DynamicModule {
  return PinoLoggerModule.forRoot({ pinoHttp: buildPinoHttpOptions(env) });
}
