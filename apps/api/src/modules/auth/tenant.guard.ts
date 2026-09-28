import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';

import { AppException } from '../../common/errors/app.exception.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { runAsTenant } from '../../infra/prisma/tenant-context.js';
import type { RequestWithAuth } from './auth.types.js';

/**
 * Resolves the caller's membership of the business the session names, once, for everyone else.
 *
 * ── Why the session's business is re-checked at all ──────────────────────────
 * The session records which business it is acting in, and that value was correct when the session
 * started. It is not correct five minutes later if somebody removed the user from the business — and
 * "removed from the team but still working" is a real thing that happens, deliberately and otherwise.
 * One indexed lookup per request is the price of the session not being a stale claim.
 *
 * ── Why it does not refuse a session with no business ────────────────────────
 * Platform staff belong to no tenant and are legitimate users of the API. Routes that NEED a business
 * say so themselves (`EntitlementGuard`), so that the failure is a specific 403 with a useful message
 * rather than a blanket refusal here.
 *
 * ── Why the membership is attached rather than re-read ───────────────────────
 * `RolesGuard` needs the role and `EntitlementGuard` needs the business. Re-reading the same row in
 * each guard would triple the query count on every protected route for no benefit.
 *
 * Reads through `runAsTenant` because `business_member` is under row-level security: from an unscoped
 * connection the policy admits nothing, so this would silently find no membership for anybody.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const auth = request.auth;

    // A public route, or one that failed nothing: `JwtAuthGuard` has already had its say.
    if (auth === undefined || auth.businessId === undefined) {
      return true;
    }

    const businessId = auth.businessId;

    const membership = await runAsTenant(
      this.prisma.getClient(),
      { businessId, userId: auth.userId },
      (tx) =>
        tx.businessMember.findFirst({
          where: { businessId, userId: auth.userId, status: 'ACTIVE' },
          select: { businessId: true, userId: true, role: true, isOwner: true },
        }),
    );

    if (membership === null) {
      throw AppException.forbidden("Vous n'avez plus accès à cette entreprise.");
    }

    request.membership = membership;

    return true;
  }
}
