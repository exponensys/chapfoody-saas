import { SetMetadata, createParamDecorator, type ExecutionContext } from '@nestjs/common';

import { AppException } from '../../common/errors/app.exception.js';
import type { AuthPrincipal, RequestWithAuth } from './auth.types.js';

export const PUBLIC_ROUTE = 'cf:public-route';

/**
 * Marks a route as reachable without a token.
 *
 * The default is the other way round — `JwtAuthGuard` is registered globally — because the failure mode
 * of forgetting to protect a route is a public endpoint, while the failure mode of forgetting `@Public()`
 * is a route that returns 401 until somebody notices. Only one of those is a security incident.
 */
export const Public = (): MethodDecorator & ClassDecorator => SetMetadata(PUBLIC_ROUTE, true);

/**
 * The authenticated caller.
 *
 * Throws rather than returning undefined when there is no principal: every route that uses it is behind
 * the guard, so reaching it unauthenticated means the guard was skipped — which is a wiring mistake, and
 * a 500 is the honest response to one.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthPrincipal => {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();

    if (request.auth === undefined) {
      throw AppException.unauthenticated(
        'Aucun utilisateur authentifié sur cette requête (garde manquante ?).',
      );
    }

    return request.auth;
  },
);
