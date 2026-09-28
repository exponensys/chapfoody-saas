import type { ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';

import { ERROR_CODES } from '../../common/errors/error-codes.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import type { RequestWithAuth } from './auth.types.js';
import { EntitlementGuard } from './entitlement.guard.js';

/**
 * `runAsTenant` is mocked at the module boundary rather than faked through the Prisma client.
 *
 * It is a plain function, not an injected dependency, and the real one builds a `$extends` client — so
 * the honest seam is the function itself: `(client, context, work) => work(tx)`. What this suite tests
 * is the DECISION (is this feature granted, and what happens when it is not), not the plumbing that
 * carries the tenant context, which the isolation suite covers against a real database.
 *
 * The `mock` prefix on the name is required, not stylistic: Jest hoists `jest.mock` above the module
 * body and refuses to let a factory close over anything that does not begin with `mock`.
 */
const mockEntitlementFindMany = jest.fn();

jest.mock('../../infra/prisma/tenant-context.js', () => ({
  runAsTenant: (
    _client: unknown,
    _context: unknown,
    work: (tx: unknown) => Promise<unknown>,
  ): Promise<unknown> => work({ entitlement: { findMany: mockEntitlementFindMany } }),
}));

/** A local alias, so the test bodies read plainly. */
const entitlementFindMany = mockEntitlementFindMany;

/**
 * The premium gate.
 *
 * M3's definition of done is precise about this one: "a request for a feature outside the subscription
 * returns a typed `403 FEATURE_NOT_IN_SUBSCRIPTION`". So these assertions are about the CODE — the thing
 * the API client branches on — and about the failure direction of the edge cases.
 */
describe('EntitlementGuard', () => {
  let reflector: { getAllAndOverride: jest.Mock };
  let guard: EntitlementGuard;
  let request: RequestWithAuth;

  function contextFor(): ExecutionContext {
    return {
      getHandler: () => 'handler',
      getClass: () => 'class',
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
  }

  /** An entitlement row, as the query selects it. */
  function entitlement(key: string, expiresAt: Date | null = null): unknown {
    return { expiresAt, feature: { key } };
  }

  beforeEach(() => {
    entitlementFindMany.mockReset().mockResolvedValue([]);

    reflector = { getAllAndOverride: jest.fn().mockReturnValue([]) };
    request = {
      headers: {},
      auth: { userId: 'user-1', sessionId: 'session-1', businessId: 'biz-1' },
    } as RequestWithAuth;

    guard = new EntitlementGuard(
      reflector as unknown as Reflector,
      { getClient: () => ({}) } as unknown as PrismaService,
    );
  });

  it('allows a route with no @RequiresFeature decorator without querying anything', async () => {
    reflector.getAllAndOverride.mockReturnValue([]);

    await expect(guard.canActivate(contextFor())).resolves.toBe(true);
    expect(entitlementFindMany).not.toHaveBeenCalled();
  });

  it('allows a route with no decorator metadata at all', async () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    await expect(guard.canActivate(contextFor())).resolves.toBe(true);
  });

  it('allows a granted feature', async () => {
    reflector.getAllAndOverride.mockReturnValue(['marketing.campaigns']);
    entitlementFindMany.mockResolvedValue([entitlement('marketing.campaigns')]);

    await expect(guard.canActivate(contextFor())).resolves.toBe(true);
  });

  it('refuses a missing feature with the TYPED 403 the definition of done names', async () => {
    reflector.getAllAndOverride.mockReturnValue(['marketing.campaigns']);
    entitlementFindMany.mockResolvedValue([]);

    await expect(guard.canActivate(contextFor())).rejects.toMatchObject({
      status: 403,
      code: ERROR_CODES.FEATURE_NOT_IN_SUBSCRIPTION,
      details: { missingFeatures: ['marketing.campaigns'] },
    });
  });

  it('names only the features that are actually missing', async () => {
    // The client can offer an upgrade for the right things rather than a generic "contact sales".
    reflector.getAllAndOverride.mockReturnValue(['storefront.customDomain', 'marketing.campaigns']);
    entitlementFindMany.mockResolvedValue([entitlement('marketing.campaigns')]);

    await expect(guard.canActivate(contextFor())).rejects.toMatchObject({
      details: { missingFeatures: ['storefront.customDomain'] },
    });
  });

  it('treats an EXPIRED entitlement as not granted', async () => {
    // `expiresAt` exists so a trial lapses on its own. Trusting a nightly job to clear it would leave
    // the feature open for however long the job is late.
    reflector.getAllAndOverride.mockReturnValue(['marketing.campaigns']);
    entitlementFindMany.mockResolvedValue([
      entitlement('marketing.campaigns', new Date(Date.now() - 1_000)),
    ]);

    await expect(guard.canActivate(contextFor())).rejects.toMatchObject({
      code: ERROR_CODES.FEATURE_NOT_IN_SUBSCRIPTION,
    });
  });

  it('honours an entitlement that has not expired yet', async () => {
    reflector.getAllAndOverride.mockReturnValue(['marketing.campaigns']);
    entitlementFindMany.mockResolvedValue([
      entitlement('marketing.campaigns', new Date(Date.now() + 86_400_000)),
    ]);

    await expect(guard.canActivate(contextFor())).resolves.toBe(true);
  });

  it('refuses an UNKNOWN feature key rather than allowing it', async () => {
    // Fails closed: a typo in a decorator closes the route instead of opening it, which is the
    // direction a security check should fail in.
    reflector.getAllAndOverride.mockReturnValue(['a.feature.that.does.not.exist']);
    entitlementFindMany.mockResolvedValue([]);

    await expect(guard.canActivate(contextFor())).rejects.toMatchObject({
      code: ERROR_CODES.FEATURE_NOT_IN_SUBSCRIPTION,
    });
  });

  it('refuses a caller with no active business, since an entitlement is per business', async () => {
    reflector.getAllAndOverride.mockReturnValue(['marketing.campaigns']);
    request.auth = { userId: 'user-1', sessionId: 'session-1' };

    await expect(guard.canActivate(contextFor())).rejects.toMatchObject({
      status: 403,
      details: { requiredFeatures: ['marketing.campaigns'] },
    });
  });

  it('refuses an unauthenticated request, since it cannot know the business', async () => {
    reflector.getAllAndOverride.mockReturnValue(['marketing.campaigns']);
    request.auth = undefined;

    await expect(guard.canActivate(contextFor())).rejects.toMatchObject({
      code: 'UNAUTHENTICATED',
    });
  });

  it('leaves `enabled` to the database rather than filtering in memory', async () => {
    // A disabled feature's row is simply not returned, so nobody has to remember to check the flag.
    reflector.getAllAndOverride.mockReturnValue(['marketing.campaigns']);

    await guard.canActivate(contextFor()).catch(() => undefined);

    expect(entitlementFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ businessId: 'biz-1', enabled: true }),
      }),
    );
  });
});

