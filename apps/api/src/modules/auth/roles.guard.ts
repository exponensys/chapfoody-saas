import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AppException } from '../../common/errors/app.exception.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { REQUIRED_ROLES } from './access.decorators.js';
import type { RequestWithAuth } from './auth.types.js';

/**
 * `@RequiresRole('OWNER', 'MANAGER')` — tenant RBAC.
 *
 * ── The membership comes from `TenantGuard`, and that is not laziness ────────
 * Reading it here would be a second query for a row the previous guard has just fetched, and two reads
 * of the same row in one request is two chances for them to disagree. The guards run in a fixed order —
 * auth, tenant, roles, entitlement — and this one depends on the one before it.
 *
 * ── Platform staff are EXEMPT, unlike in the entitlement check ───────────────
 * A `SUPER_ADMIN` is not a member of anybody's business, so a role check would refuse them every
 * administrative route. The distinction is deliberate: roles describe what someone may do *inside a
 * tenant they belong to*, and platform staff belong to none. Entitlement is different — it is about
 * what a business has paid for, so staff get no exemption there.
 *
 * ── The platform role is read only when a route actually needs it ────────────
 * One extra query, on the few routes that carry this decorator, rather than a claim added to every
 * access token so that a rare check can be cheap.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(REQUIRED_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (required === undefined || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const auth = request.auth;

    if (auth === undefined) {
      throw AppException.unauthenticated('Authentification requise.');
    }

    if (await this.isPlatformStaff(auth.userId)) {
      return true;
    }

    const membership = request.membership;

    if (membership === undefined) {
      // No active business, or the membership was not resolved — either way this route is not for them.
      throw AppException.forbidden('Action réservée aux membres de cette entreprise.');
    }

    if (!required.includes(membership.role)) {
      throw AppException.forbidden('Votre rôle ne permet pas cette action.', {
        // What was needed and what the caller has, so the frontend can disable rather than merely hide.
        requiredRoles: required,
        actualRole: membership.role,
      });
    }

    return true;
  }

  private async isPlatformStaff(userId: string): Promise<boolean> {
    // Read on the base client: `app_user` carries no row-level security, and platform staff belong to no
    // tenant, so there is no context that could make this visible.
    const user = await this.prisma.getClient().user.findUnique({
      where: { id: userId },
      select: { platformRole: true, deletedAt: true },
    });

    return user !== null && user.deletedAt === null && user.platformRole !== null;
  }
}
