import type { PrismaClient } from '../../generated/prisma/client.js';

/**
 * Tenant context — how a request tells PostgreSQL which tenant it acts for.
 *
 * ── Why this exists ──────────────────────────────────────────────────────────
 * The row-level security policies (prisma/migrations/*_m2_row_level_security) read
 * three session variables. Nothing happens until somebody sets them: an unscoped
 * connection sees zero rows, by design. This module is the only place that sets them.
 *
 * ── Transaction-local, always ────────────────────────────────────────────────
 * `set_config(name, value, true)` scopes the setting to the current transaction. That
 * `true` is not a detail: connections are pooled, and a session-scoped setting would
 * survive hand-off to the next request and quietly serve one tenant's rows to another.
 * Transaction-local means the context cannot outlive the work it was set for, even if
 * the request crashes mid-flight.
 *
 * The consequence worth knowing: the setting is only valid *inside* a transaction, so
 * tenant-scoped work goes through `runAsTenant`, never through a bare query.
 */

/** Tenant the request acts in. Read by every isolation policy. */
export const BUSINESS_ID_SETTING = 'app.business_id';

/** Authenticated user. Required because sign-in reads membership before a tenant exists. */
export const USER_ID_SETTING = 'app.user_id';

/** Hash of the token in an invitation link — unlocks exactly one row, pre-authentication. */
export const INVITATION_TOKEN_SETTING = 'app.invitation_token';

export interface TenantContext {
  /** The tenant to act in. Omit only for platform-level work (super-admin, sign-in). */
  readonly businessId?: string;
  /** The authenticated user. */
  readonly userId?: string;
  /** Only while accepting an invitation, before the invitee is a member. */
  readonly invitationTokenHash?: string;
}

/** The interactive transaction client handed to `runAsTenant` callbacks. */
export type TenantTransaction = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

/**
 * Runs `work` with the tenant context applied.
 *
 * The callback receives a transaction client: queries made through it inherit the
 * context, and queries made through the outer client do not — the type makes that
 * distinction explicit rather than something to remember.
 *
 *   await runAsTenant(prisma, { businessId, userId }, (tx) => tx.product.findMany());
 */
export async function runAsTenant<T>(
  prisma: PrismaClient,
  context: TenantContext,
  work: (tx: TenantTransaction) => Promise<T>,
): Promise<T> {
  // The scoping extension is built on the BASE client and then used to open the
  // transaction, so the callback receives a client that is already both scoped and
  // contextualised. This ordering is forced: `$extends` does not exist on a transaction
  // client, so it cannot be applied from inside the callback. Doing it the other way round
  // — extending a client outside the transaction and passing it in — silently ran the
  // query without the context, which a policy then rejected.
  const client: PrismaClient =
    context.businessId === undefined ? prisma : scopeToTenant(prisma, context.businessId);

  return client.$transaction(async (tx) => {
    await applyTenantContext(tx, context);
    return work(tx as unknown as TenantTransaction);
  });
}

/**
 * Sets the context variables on an existing transaction.
 *
 * Exported for callers that already own a transaction and must not open a nested one —
 * the seed, which writes several tenants in one pass.
 *
 * Absent values are written as empty strings rather than skipped: the SQL helpers map
 * `''` to NULL, so an absent value reads as "no tenant" instead of "not set". Both fail
 * closed, but one is explicit.
 */
export async function applyTenantContext(
  tx: Pick<TenantTransaction, '$queryRaw'>,
  context: TenantContext,
): Promise<void> {
  await tx.$queryRaw`SELECT
    set_config(${BUSINESS_ID_SETTING}, ${context.businessId ?? ''}, true),
    set_config(${USER_ID_SETTING}, ${context.userId ?? ''}, true),
    set_config(${INVITATION_TOKEN_SETTING}, ${context.invitationTokenHash ?? ''}, true)`;
}

/**
 * Models that carry a `businessId` — the ones the policies protect.
 *
 * This drives the second line of defence below. The database already refuses
 * cross-tenant rows if a query forgets a filter; the extension adds the filter anyway,
 * so a missed `where` cannot even reach the database. A unit test parses
 * prisma/models/*.prisma and fails if this list and the schema disagree, so a new
 * domain cannot forget to declare itself here.
 */
export const TENANT_SCOPED_MODELS: ReadonlySet<string> = new Set([
  'AuditLog',
  'BusinessMember',
  // Catalogue (M2, increment 2)
  'Collection',
  'CollectionProduct',
  'Ingredient',
  'Modifier',
  'ModifierGroup',
  'PriceList',
  'PriceListItem',
  'Product',
  'ProductAllergen',
  'ProductCategory',
  'ProductModifierGroup',
  'ProductVariant',
  'Recipe',
  'RecipeLine',
  'Utensil',
  // Subscriptions and billing
  'Entitlement',
  'Invitation',
  'Payment',
  'PaymentMethod',
  'PlatformInvoice',
  'Subscription',
  'SubscriptionItem',
  'UsageCounter',
]);

// Business is deliberately absent, even though it is the tenant root: it has no
// `business_id` column, because its own `id` IS the tenant. Injecting `{ businessId }`
// into a Business filter would reference a field that does not exist. Its isolation comes
// from its policy (`id = cf_current_business_id()`), which is the right shape for a table
// whose primary key is the tenant identifier.

/**
 * Operations that accept a full filter, i.e. many rows. Only these can take an extra
 * `AND` clause.
 *
 * `findUnique`, `update`, `delete` and `upsert` are deliberately absent: Prisma requires a
 * *unique* key for them, so wrapping the key in `AND` makes Prisma reject the argument
 * outright ("Unknown argument `businessId_userId`"). Those operations are covered by
 * row-level security instead, which is the backstop that cannot be bypassed by a caller
 * shaping the arguments differently.
 */
const FILTER_OPERATIONS: ReadonlySet<string> = new Set([
  'aggregate',
  'count',
  'deleteMany',
  'findFirst',
  'findFirstOrThrow',
  'findMany',
  'groupBy',
  'updateMany',
]);

/** Operations that create rows, and so must be stamped with the tenant. */
const CREATE_OPERATIONS: ReadonlySet<string> = new Set([
  'create',
  'createMany',
  'createManyAndReturn',
]);

/**
 * Returns a client that stamps the tenant onto every write and every filter of a
 * tenant-scoped model.
 *
 * Both injections only ever *narrow* access:
 *   • filters are combined with AND, so an existing `OR` cannot be widened or replaced;
 *   • a write's `businessId` is overwritten with the context value, so a payload cannot
 *     claim another tenant by naming it.
 *
 * Models outside `TENANT_SCOPED_MODELS` pass through untouched — platform tables such
 * as User and Plan are legitimately cross-tenant.
 */
export function scopeToTenant<T extends PrismaClient>(prisma: T, businessId: string): T {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!TENANT_SCOPED_MODELS.has(model)) {
            return query(args);
          }

          const scoped = args as Record<string, unknown>;

          if (FILTER_OPERATIONS.has(operation)) {
            scoped.where = { AND: [scoped.where ?? {}, { businessId }] };
          }

          if (CREATE_OPERATIONS.has(operation)) {
            scoped.data = Array.isArray(scoped.data)
              ? scoped.data.map((row: object) => ({ ...row, businessId }))
              : { ...(scoped.data as object), businessId };
          }

          if (operation === 'upsert') {
            // Both branches are stamped so the row cannot be created for, or moved to,
            // another tenant. `where` is left exactly as the caller wrote it: Prisma
            // demands a unique key there, and a unique key that omits `businessId` is
            // still protected by the policy.
            scoped.create = { ...(scoped.create as object), businessId };
            scoped.update = { ...(scoped.update as object), businessId };
          }

          return query(scoped);
        },
      },
    },
  }) as unknown as T;
}
