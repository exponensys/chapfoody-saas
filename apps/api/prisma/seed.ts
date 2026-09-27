/**
 * Seed — the platform's starting data (requirement F).
 *
 *   pnpm --filter @chapfoody/api exec prisma db seed
 *
 * ── What it writes ───────────────────────────────────────────────────────────
 *   1. BusinessType                     the ten dashboards
 *   2. Feature                          the premium registry
 *   3. Plan + PlanFeature               Free / Standard / Premium
 *   4. User                             the eight accounts of plan section 5.4
 *   5. Business, BusinessMember,        one business per client account, with its
 *      Subscription, Entitlement,       resolved entitlements
 *      AuditLog
 *
 * ── Why the tenant-scoped writes go through the tenant context ───────────────
 * Every business-scoped write below runs inside `runAsTenant`, which sets
 * `app.business_id` / `app.user_id` for the transaction. Two consequences, both wanted:
 *   • the seed cannot write what the application could not write — if a policy is wrong,
 *     the seed fails loudly instead of quietly inserting around it;
 *   • it exercises the same path a request takes, so `migrate reset` doubles as an
 *     end-to-end check of tenant isolation on a brand-new database.
 *
 * ── Idempotency ──────────────────────────────────────────────────────────────
 * Upserts on natural keys (email, slug, key) throughout, so running it twice leaves the
 * database unchanged. `audit_log` is the exception and uses `skipDuplicates`, because it
 * has no natural key and its RLS policies permit no UPDATE at all — an append-only table
 * cannot be upserted, by design.
 *
 * ── Deferred to the catalog and sales increments ─────────────────────────────
 * The plan also calls for a demo catalog, stock and a few orders per business. Those
 * tables do not exist yet — this increment covers identity, tenancy and subscriptions.
 * The businesses seeded here are what that demo data will hang off.
 */
import { existsSync } from 'node:fs';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../src/generated/prisma/client.js';
import { hashPassword } from '../src/infra/crypto/password.js';
import { runAsTenant } from '../src/infra/prisma/tenant-context.js';
import { ACCOUNTS } from './seed/accounts.js';
import { FEATURES } from './seed/features.js';
import { BUSINESS_TYPES, PLANS } from './seed/plans.js';

// The Prisma CLI does not load .env.local; the seed needs the same DATABASE_URL the API
// uses (the least-privilege role), so it loads the file itself.
if (existsSync('.env.local')) {
  process.loadEnvFile('.env.local');
}

/**
 * Refuses to run against production.
 *
 * The eight passwords are published in the requirements document, so seeding them into
 * production would hand out working credentials for every demo account. An explicit
 * override exists rather than a hard block, because staging legitimately wants demo data.
 */
function assertNotProduction(): void {
  if (process.env.NODE_ENV === 'production' && process.env.SEED_ALLOW_PRODUCTION !== 'true') {
    throw new Error(
      'Refusing to seed: NODE_ENV is "production" and the seeded passwords are public. ' +
        'Set SEED_ALLOW_PRODUCTION=true only if you really mean it.',
    );
  }
}

function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL;

  if (url === undefined || url === '') {
    throw new Error('DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.');
  }

  return new PrismaClient({ adapter: new PrismaPg(url) });
}

/** Business types and features are platform-level: no tenant context, no RLS. */
async function seedBusinessTypes(prisma: PrismaClient): Promise<void> {
  for (const type of BUSINESS_TYPES) {
    const data = {
      labelFr: type.labelFr,
      labelEn: type.labelEn,
      icon: type.icon,
      isClientCategory: type.isClientCategory,
      sortOrder: BUSINESS_TYPES.indexOf(type),
    };

    await prisma.businessType.upsert({
      where: { key: type.key },
      create: { key: type.key, ...data },
      update: data,
    });
  }
}

async function seedFeatures(prisma: PrismaClient): Promise<void> {
  for (const entry of FEATURES) {
    const data = {
      labelFr: entry.labelFr,
      labelEn: entry.labelEn,
      category: entry.category,
      kind: entry.kind,
      quotaUnit: entry.quotaUnit,
      appliesToCategories: [...entry.appliesToCategories],
      sortOrder: entry.sortOrder,
    };

    await prisma.feature.upsert({
      where: { key: entry.key },
      create: { key: entry.key, ...data },
      update: data,
    });
  }
}

/** Look-up maps so the last step can wire rows together without extra round trips. */
interface SeedRegistry {
  readonly planIdByKey: ReadonlyMap<string, string>;
  readonly featureIds: readonly { readonly id: string; readonly key: string }[];
  readonly businessTypeIdByKey: ReadonlyMap<string, string>;
}

async function seedPlans(prisma: PrismaClient): Promise<{
  planIdByKey: Map<string, string>;
  featureIds: { id: string; key: string }[];
}> {
  const featureIds = await prisma.feature.findMany({
    select: { id: true, key: true },
    orderBy: { sortOrder: 'asc' },
  });

  const featureIdByKey = new Map(featureIds.map((feature) => [feature.key, feature.id]));
  const planIdByKey = new Map<string, string>();

  for (const plan of PLANS) {
    const data = {
      name: plan.name,
      description: plan.description,
      // A string, not a number: DECIMAL(14,2) must never round-trip through a JS float.
      price: plan.price,
      currency: plan.currency,
      billingPeriod: plan.billingPeriod,
      trialDays: plan.trialDays,
      sortOrder: plan.sortOrder,
      isActive: true,
      isPublic: true,
    };

    const row = await prisma.plan.upsert({
      where: { key: plan.key },
      create: { key: plan.key, ...data },
      update: data,
    });

    planIdByKey.set(plan.key, row.id);

    // Every feature is linked to every plan, including as `enabled: false`.
    // A missing row would mean "unknown feature", which the entitlement guard cannot
    // distinguish from "not included" — so the absence is written down explicitly.
    for (const feature of FEATURES) {
      const featureId = featureIdByKey.get(feature.key);

      if (featureId === undefined) {
        throw new Error(`Feature "${feature.key}" was not persisted before plans were linked.`);
      }

      const inclusion = feature.plans[plan.key];
      const link = {
        enabled: inclusion !== false,
        quota: typeof inclusion === 'number' ? inclusion : null,
      };

      await prisma.planFeature.upsert({
        where: { planId_featureId: { planId: row.id, featureId } },
        create: { planId: row.id, featureId, ...link },
        update: link,
      });
    }
  }

  return { planIdByKey, featureIds };
}

/** One month later, without pulling in a date library for a two-line operation. */
function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

async function seedAccounts(prisma: PrismaClient, registry: SeedRegistry): Promise<number> {
  const featureSeedByKey = new Map(FEATURES.map((entry) => [entry.key, entry]));
  let businessesSeeded = 0;

  for (const account of ACCOUNTS) {
    // Users are platform-level: no tenant context, and app_user carries no RLS.
    const passwordHash = await hashPassword(account.password);

    const user = await prisma.user.upsert({
      where: { email: account.email },
      create: {
        email: account.email,
        passwordHash,
        // Every seeded account rotates on first sign-in: these passwords are public.
        mustChangePassword: true,
        emailVerifiedAt: new Date(),
        firstName: account.firstName,
        lastName: account.lastName,
        status: 'ACTIVE',
        platformRole: account.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : null,
      },
      // Re-hashed on every run, so editing a password here takes effect on an existing
      // database and not only on a fresh one.
      update: { passwordHash, mustChangePassword: true },
    });

    if (account.business === null) {
      continue;
    }

    const business = account.business;
    const businessTypeId = registry.businessTypeIdByKey.get(business.category);
    const planId = registry.planIdByKey.get(business.planKey);

    if (businessTypeId === undefined) {
      throw new Error(`Unknown business type "${business.category}" for ${account.email}.`);
    }

    if (planId === undefined) {
      throw new Error(`Unknown plan "${business.planKey}" for ${account.email}.`);
    }

    // Transaction 1 — the tenant itself. The RLS INSERT policy requires the new row's
    // owner_id to be the acting user, so setting the user context is what makes this
    // legal: the seed obeys the same rule the sign-up flow will.
    const tenant = await runAsTenant(prisma, { userId: user.id }, (tx) =>
      tx.business.upsert({
        where: { slug: business.slug },
        create: {
          slug: business.slug,
          name: business.name,
          businessTypeId,
          ownerId: user.id,
          status: 'ACTIVE',
          currency: business.currency,
          locale: 'FR',
          timezone: business.timezone,
          country: business.country,
          city: business.city,
          onboardingCompletedAt: new Date(),
        },
        update: {
          name: business.name,
          businessTypeId,
          status: 'ACTIVE',
          onboardingCompletedAt: new Date(),
        },
      }),
    );

    // Transaction 2 — everything belonging to that tenant, written with the tenant in
    // context so every policy from business_member to audit_log applies exactly as it
    // would for production code.
    await runAsTenant(prisma, { businessId: tenant.id, userId: user.id }, async (tx) => {
      const now = new Date();

      await tx.businessMember.upsert({
        where: { businessId_userId: { businessId: tenant.id, userId: user.id } },
        create: {
          businessId: tenant.id,
          userId: user.id,
          role: 'OWNER',
          status: 'ACTIVE',
          isOwner: true,
          joinedAt: now,
        },
        update: { role: 'OWNER', status: 'ACTIVE' },
      });

      await tx.subscription.upsert({
        where: { businessId: tenant.id },
        create: {
          businessId: tenant.id,
          planId,
          status: 'ACTIVE',
          startedAt: now,
          currentPeriodStart: now,
          currentPeriodEnd: addMonths(now, 1),
        },
        update: { planId, status: 'ACTIVE', currentPeriodEnd: addMonths(now, 1) },
      });

      // The resolved entitlements for this business — the answer the entitlement guard
      // will read on every gated request. Written for every feature: `enabled: false` is
      // a decision, whereas a missing row is an ambiguity the guard cannot resolve.
      for (const feature of registry.featureIds) {
        const inclusion = featureSeedByKey.get(feature.key)?.plans[business.planKey] ?? false;

        const entitlement = {
          enabled: inclusion !== false,
          quota: typeof inclusion === 'number' ? inclusion : null,
          source: 'PLAN' as const,
        };

        await tx.entitlement.upsert({
          where: { businessId_featureId: { businessId: tenant.id, featureId: feature.id } },
          create: { businessId: tenant.id, featureId: feature.id, ...entitlement },
          update: entitlement,
        });
      }

      // Append-only, and the RLS policies allow no UPDATE on this table — so this is a
      // createMany with skipDuplicates rather than an upsert, keyed on a deterministic id.
      await tx.auditLog.createMany({
        data: [
          {
            id: `seed_business_${tenant.slug}`,
            businessId: tenant.id,
            actorType: 'SYSTEM',
            action: 'business.seeded',
            entityType: 'Business',
            entityId: tenant.id,
            metadata: { source: 'prisma/seed.ts' },
          },
        ],
        skipDuplicates: true,
      });
    });

    businessesSeeded += 1;
    process.stdout.write(`  ${account.email} → ${tenant.slug} (${business.planKey})\n`);
  }

  return businessesSeeded;
}

async function main(): Promise<void> {
  assertNotProduction();

  const prisma = createClient();

  try {
    await seedBusinessTypes(prisma);
    await seedFeatures(prisma);

    const { planIdByKey, featureIds } = await seedPlans(prisma);

    const businessTypes = await prisma.businessType.findMany({ select: { id: true, key: true } });

    const businessesSeeded = await seedAccounts(prisma, {
      planIdByKey,
      featureIds,
      businessTypeIdByKey: new Map(businessTypes.map((type) => [type.key, type.id])),
    });

    const [plans, features, users] = await Promise.all([
      prisma.plan.count(),
      prisma.feature.count(),
      prisma.user.count(),
    ]);

    // Business is deliberately NOT counted with `prisma.business.count()`: those rows are
    // under row-level security, and this connection has no tenant context, so the query
    // would honestly return 0. That is the fail-closed behaviour working — worth knowing
    // before someone "fixes" this line. The seed's own tally is reported instead.
    process.stdout.write(
      `\nSeed complete: ${plans} plans, ${features} features, ${users} users, ` +
        `${businessesSeeded} businesses.\n` +
        'Every account must change its password at first sign-in.\n',
    );
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error: unknown) => {
  process.stderr.write(`Seed failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
