import { SetMetadata, createParamDecorator, type ExecutionContext } from '@nestjs/common';

import { AppException } from '../../common/errors/app.exception.js';
import type { RequestWithAuth } from './auth.types.js';

export const REQUIRED_FEATURES = 'cf:required-features';
export const REQUIRED_ROLES = 'cf:required-roles';

/**
 * Requires an entitlement for the business the caller is acting in.
 *
 * `@RequiresFeature('marketing.campaigns')` — the key is a `Feature.key`, and the check is against the
 * business's resolved `Entitlement`, not against a plan name. The server is the only source of truth:
 * a client that hides a button has hidden a button, and nothing more.
 *
 * Several keys may be listed, and ALL of them are required. An ANY-of variant would be a second
 * decorator rather than a flag, because the difference between the two is exactly the kind of thing
 * that gets misread at a call site.
 */
export const RequiresFeature = (
  ...features: string[]
): MethodDecorator & ClassDecorator => SetMetadata(REQUIRED_FEATURES, features);

/**
 * Requires a tenant role. `SUPER_ADMIN` is not a role anyone is a MEMBER as, so the guard treats
 * platform staff as exempt rather than making them owners of every business.
 */
export const RequiresRole = (...roles: string[]): MethodDecorator & ClassDecorator =>
  SetMetadata(REQUIRED_ROLES, roles);

/** The caller's membership of the business the session is acting in. */
export interface TenantMembership {
  businessId: string;
  userId: string;
  role: string;
  isOwner: boolean;
}

/**
 * The caller's membership, or a 403.
 *
 * Throws rather than returning undefined: a route using it is behind `TenantGuard`, so an absent
 * membership means the guard was skipped — a wiring mistake, and a 500 is the honest response.
 */
export const CurrentMembership = createParamDecorator(
  (_data: unknown, context: ExecutionContext): TenantMembership => {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();

    if (request.membership === undefined) {
      throw AppException.forbidden(
        'Aucune adhésion à cette entreprise sur cette requête (garde manquante ?).',
      );
    }

    return request.membership;
  },
);
