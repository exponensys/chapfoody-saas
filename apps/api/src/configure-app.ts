import type { INestApplication } from '@nestjs/common';

import { API_PREFIX } from './app.constants.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { requestIdMiddleware } from './common/http/request-id.middleware.js';
import { createValidationPipe } from './common/pipes/validation.pipe.js';
import type { ApiEnv } from './config/env.js';
import { setupSwagger } from './swagger.js';

/**
 * Routes served outside the versioned prefix.
 *
 * Probes answer at `/health`, not `/v1/health`: an orchestrator's probe path should
 * not have to change when the API version does.
 */
export const UNPREFIXED_ROUTES = ['health', 'health/db', 'health/queue'];

export interface ConfigureAppOptions {
  /** Mount the OpenAPI documentation. Defaults to the environment's own setting. */
  withSwagger?: boolean;
}

/**
 * Applies every cross-cutting concern to an application instance.
 *
 * Shared by the bootstrap (`main.ts`), the OpenAPI export and the test harness —
 * so a test can never pass against an app configured differently from the one that
 * actually runs. Duplicating this in the tests is the classic source of
 * "green tests, broken production".
 *
 * Order matters:
 *   1. correlation ids, so everything downstream can rely on `req.requestId`;
 *   2. CORS, pipes and the exception filter (global concerns);
 *   3. the route prefix, which must be set before Swagger builds its document.
 */
export function configureApp(
  app: INestApplication,
  env: ApiEnv,
  options: ConfigureAppOptions = {},
): INestApplication {
  const withSwagger = options.withSwagger ?? env.swaggerEnabled;

  // Do not advertise the framework. It costs nothing to hide and gives an attacker
  // one less version fingerprint to work from.
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.use(requestIdMiddleware);

  // Behind a proxy, `req.ip` is the proxy's address unless Express is told to trust the forwarding
  // header — and the rate limiter counts by client. Without this, every request appears to come from the
  // load balancer, so the limit becomes global and one busy client locks out everybody. Set for
  // production only: trusting the header locally would let anybody spoof their own address.
  if (env.nodeEnv === 'production') {
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
  }

  app.enableCors({
    origin: env.corsOrigins,
    // Required for the httpOnly refresh cookie introduced in M3.
    credentials: true,
  });

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix(API_PREFIX, { exclude: UNPREFIXED_ROUTES });

  if (withSwagger) {
    setupSwagger(app);
  }

  return app;
}
