import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AppException } from '../../common/errors/app.exception.js';
import { ERROR_CODES } from '../../common/errors/error-codes.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { runAsTenant } from '../../infra/prisma/tenant-context.js';
import { REQUIRED_FEATURES } from './access.decorators.js';
import type { RequestWithAuth } from './auth.types.js';

/**
 * `@RequiresFeature('marketing.campaigns')` — the server's answer to "is this in the subscription?".
 *
 * ── Why the check is against entitlements and not against a plan ─────────────
 * A plan is a template; an entitlement is what this business actually has, after the plan, any
 * override, and any trial. Trials and overrides are the reason the two exist separately, and checking
 * the plan name would quietly ignore both.
 *
 * ── Expiry is checked here, not by a job ─────────────────────────────────────
 * `Entitlement.expiresAt` exists so that a trial lapses on its own. Trusting a nightly job to clear it
 * would mean the feature stays open for however long the job is late.
 *
 * ── Unknown keys refuse ──────────────────────────────────────────────────────
 * A feature key that matches nothing is not granted, so a typo in a decorator closes the route rather
 * than opening it. That is the failure direction a security check should fail in.
 *
 * ── Platform staff are NOT exempt ────────────────────────────────────────────
 * Deliberately. Entitlement is about what a business has paid for, and a super-admin "testing a
 * feature" on a customer's business is what impersonation is for — with the audit trail that implies.
 */
@Injectable()
export class EntitlementGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(REQUIRED_FEATURES, [
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

    if (auth.businessId === undefined) {
      throw AppException.forbidden(
        'Aucune entreprise active : cette fonctionnalité dépend d’un abonnement.',
        { requiredFeatures: required },
      );
    }

    const businessId = auth.businessId;

    const granted = await runAsTenant(this.prisma.getClient(), { businessId }, async (tx) => {
      const rows = await tx.entitlement.findMany({
        where: {
          businessId,
          enabled: true,
          feature: { key: { in: required } },
        },
        select: { expiresAt: true, feature: { select: { key: true } } },
      });

      return new Set(
        rows
          .filter((row) => row.expiresAt === null || row.expiresAt.getTime() > Date.now())
          .map((row) => row.feature.key),
      );
    });

    const missing = required.filter((key) => !granted.has(key));

    if (missing.length > 0) {
      throw new AppException(
        403,
        ERROR_CODES.FEATURE_NOT_IN_SUBSCRIPTION,
        'Cette fonctionnalité ne fait pas partie de votre abonnement.',
        // Which features were missing, so the client can offer the right upgrade rather than a generic
        // "contact sales" — and the plan's client-side predicate branches on the code above.
        { missingFeatures: missing },
      );
    }

    return true;
  }
}
