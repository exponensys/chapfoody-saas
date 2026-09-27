import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../src/generated/prisma/client.js';
import { applyTenantContext, runAsTenant } from '../src/infra/prisma/tenant-context.js';

/**
 * Tenant isolation, against a real PostgreSQL.
 *
 * The most important test in the repository: one tenant reading another's rows is the
 * failure that would end the product's reputation, and application-level filtering cannot
 * prove it does not happen — the API might simply forget a `where` one day. These
 * assertions exercise the row-level security policies instead.
 *
 * ── The connection must be the application role ───────────────────────────────
 * `INTEGRATION_DATABASE_URL` must point at a NON-superuser, NOBYPASSRLS role
 * (`chapfoody_app`; see prisma/sql/app-role.sql). PostgreSQL exempts superusers and
 * BYPASSRLS roles from every policy, so running these assertions as the schema owner
 * would make them pass unconditionally — worse than not having them, because they would
 * look like assurance. The suite inspects the role it was given and refuses to run
 * otherwise.
 *
 *   INTEGRATION_DATABASE_URL="postgresql://chapfoody_app:…@localhost:5432/chapfoody_db" \
 *     pnpm --filter @chapfoody/api test:integration
 *
 * ── What it leaves behind ─────────────────────────────────────────────────────
 * Probe rows carry a per-run suffix. Cleanup removes everything the policies permit,
 * which is deliberately not everything: `audit_log` is append-only and a business has no
 * DELETE policy (closed, never erased). Those residues are the policies working.
 * `prisma migrate reset` clears a local database fully.
 */
const databaseUrl = process.env.INTEGRATION_DATABASE_URL;
const describeWhenConfigured = databaseUrl === undefined ? describe.skip : describe;

if (databaseUrl === undefined) {
  process.stdout.write(
    '\n⏭  Skipping the tenant isolation suite: INTEGRATION_DATABASE_URL is not set.\n' +
      '   It must be an application role (NOSUPERUSER NOBYPASSRLS), not the owner.\n\n',
  );
}

describeWhenConfigured('Tenant isolation (integration)', () => {
  let prisma: PrismaClient;

  // Unique per run, so a repeated run never collides with a previous one's residue.
  const suffix = `iso${Date.now().toString(36)}`;

  let ownerA = '';
  let ownerB = '';
  let tenantA = '';
  let tenantB = '';

  beforeAll(async () => {
    prisma = new PrismaClient({ adapter: new PrismaPg(databaseUrl as string) });

    // ── The role check ───────────────────────────────────────────────────────
    const [role] = await prisma.$queryRaw<
      { who: string; superuser: boolean; bypassrls: boolean }[]
    >`SELECT current_user AS who,
             (SELECT rolsuper FROM pg_roles WHERE rolname = current_user) AS superuser,
             (SELECT rolbypassrls FROM pg_roles WHERE rolname = current_user) AS bypassrls`;

    if (role?.superuser === true || role?.bypassrls === true) {
      throw new Error(
        `INTEGRATION_DATABASE_URL connects as "${role.who}", which bypasses row-level ` +
          'security. These tests would pass without proving anything. Use the ' +
          'application role instead (see prisma/sql/app-role.sql).',
      );
    }

    // ── Fixtures ─────────────────────────────────────────────────────────────
    const type = await prisma.businessType.upsert({
      where: { key: `isolation-probe-${suffix}` },
      create: {
        key: `isolation-probe-${suffix}`,
        labelFr: 'Sonde isolation',
        labelEn: 'Isolation probe',
        isClientCategory: true,
        sortOrder: 999,
      },
      update: {},
    });

    const [userA, userB] = await Promise.all([
      prisma.user.create({
        data: { email: `owner-a-${suffix}@isolation.test`, firstName: 'Owner', lastName: 'A' },
      }),
      prisma.user.create({
        data: { email: `owner-b-${suffix}@isolation.test`, firstName: 'Owner', lastName: 'B' },
      }),
    ]);
    ownerA = userA.id;
    ownerB = userB.id;

    // The RLS INSERT policy requires owner_id to be the acting user, so the context is
    // what makes these writes legal — the same rule the sign-up flow will follow.
    const created = await Promise.all(
      [
        { owner: ownerA, slug: `iso-a-${suffix}`, name: 'Probe A' },
        { owner: ownerB, slug: `iso-b-${suffix}`, name: 'Probe B' },
      ].map((spec) =>
        runAsTenant(prisma, { userId: spec.owner }, (tx) =>
          tx.business.create({
            data: {
              slug: spec.slug,
              name: spec.name,
              businessTypeId: type.id,
              ownerId: spec.owner,
              status: 'ACTIVE',
              currency: 'EUR',
              country: 'FR',
            },
          }),
        ),
      ),
    );

    tenantA = created[0]?.id ?? '';
    tenantB = created[1]?.id ?? '';

    await Promise.all([
      runAsTenant(prisma, { businessId: tenantA, userId: ownerA }, (tx) =>
        tx.businessMember.create({
          data: { businessId: tenantA, userId: ownerA, role: 'OWNER', isOwner: true },
        }),
      ),
      runAsTenant(prisma, { businessId: tenantB, userId: ownerB }, (tx) =>
        tx.businessMember.create({
          data: { businessId: tenantB, userId: ownerB, role: 'OWNER', isOwner: true },
        }),
      ),
    ]);
  }, 30_000);

  afterAll(async () => {
    if (prisma === undefined) {
      return;
    }

    // Cleanup obeys the same policies as everything else. Business rows cannot be
    // deleted by the application role at all (there is no DELETE policy), so those
    // attempts affect zero rows and are swallowed rather than failing the suite.
    for (const [tenant, owner] of [
      [tenantA, ownerA],
      [tenantB, ownerB],
    ] as const) {
      if (tenant === '') {
        continue;
      }

      await runAsTenant(prisma, { businessId: tenant, userId: owner }, async (tx) => {
        await tx.businessMember.deleteMany();
        await tx.business.deleteMany({ where: { id: tenant } });
      }).catch(() => undefined);
    }

    await prisma.$disconnect();
  }, 30_000);

  it('shows a tenant only its own business', async () => {
    const visible = await runAsTenant(prisma, { businessId: tenantA, userId: ownerA }, (tx) =>
      tx.business.findMany({ select: { id: true } }),
    );

    expect(visible.map((row) => row.id)).toEqual([tenantA]);
  });

  it("returns nothing when asked for another tenant's rows by id", async () => {
    const stolen = await runAsTenant(prisma, { businessId: tenantA, userId: ownerA }, (tx) =>
      tx.businessMember.findMany({ where: { businessId: tenantB } }),
    );

    expect(stolen).toEqual([]);
  });

  it("keeps a tenant's customers and their consent history to itself", async () => {
    // Customers are the most sensitive rows in the schema, and consent is the one thing here that
    // exists specifically to be produced as evidence — so both halves are checked: another tenant
    // must not READ them, and must not be able to FILE a consent event against them.
    //
    // The probe rows are deliberately not cleaned up. `customer_consent` is append-only, so the
    // consent event below cannot be deleted and neither, therefore, can the customer it references.
    // That is the design working, not a leaky test: an audit trail that a test could tidy away
    // would not be one.
    const customer = await runAsTenant(
      prisma,
      { businessId: tenantA, userId: ownerA },
      (tx) =>
        tx.customer.create({
          data: {
            businessId: tenantA,
            number: `ISO-${suffix}`,
            firstName: 'Probe',
            email: `iso-${suffix}@probe.test`,
            status: 'ACTIVE',
            source: 'MANUAL',
          },
        }),
    );

    await runAsTenant(prisma, { businessId: tenantA, userId: ownerA }, (tx) =>
      tx.customerConsent.create({
        data: {
          businessId: tenantA,
          customerId: customer.id,
          channel: 'EMAIL',
          purpose: 'MARKETING',
          status: 'GRANTED',
          source: 'WEB',
          // Required by a CHECK: a grant that records neither the wording nor its version proves
          // nothing, and the constraint refuses it rather than trusting the caller.
          policyVersion: 'v1',
        },
      }),
    );

    // Tenant B, asking for everything and then asking for the row by name.
    const leaked = await runAsTenant(
      prisma,
      { businessId: tenantB, userId: ownerB },
      async (tx) => ({
        all: await tx.customer.findMany({ select: { id: true } }),
        byId: await tx.customer.findMany({ where: { id: customer.id } }),
        consents: await tx.customerConsent.findMany({ select: { id: true } }),
      }),
    );

    expect(leaked.all).toEqual([]);
    expect(leaked.byId).toEqual([]);
    expect(leaked.consents).toEqual([]);

    // And tenant B cannot file consent against tenant A's customer. The scoping extension rewrites
    // the businessId, so this is refused by the INSERT policy rather than silently re-homed.
    await expect(
      runAsTenant(prisma, { businessId: tenantB, userId: ownerB }, (tx) =>
        tx.customerConsent.create({
          data: {
            businessId: tenantA,
            customerId: customer.id,
            channel: 'SMS',
            purpose: 'MARKETING',
            status: 'GRANTED',
            source: 'WEB',
            policyVersion: 'v1',
          },
        }),
      ),
    ).rejects.toThrow();
  });

  it('refuses a write that names another tenant', async () => {
    await expect(
      runAsTenant(prisma, { businessId: tenantA, userId: ownerA }, (tx) =>
        tx.businessMember.create({
          data: { businessId: tenantB, userId: ownerA, role: 'MANAGER' },
        }),
      ),
    ).rejects.toThrow();
  });

  it('fails closed: with no tenant context, tenant tables look empty', async () => {
    // Deliberately NOT inside runAsTenant. This is what a forgotten context looks like:
    // data disappears rather than leaking, which is the direction to fail in.
    await expect(prisma.business.findMany()).resolves.toEqual([]);
    await expect(prisma.businessMember.findMany()).resolves.toEqual([]);
  });

  it('lets a user see their own membership before choosing a tenant', async () => {
    // The sign-in flow: a user context and no tenant, because the user has not picked a
    // business yet. Only their own membership must be visible.
    const memberships = await runAsTenant(prisma, { userId: ownerA }, (tx) =>
      tx.businessMember.findMany({ select: { businessId: true, userId: true } }),
    );

    expect(memberships).toEqual([{ businessId: tenantA, userId: ownerA }]);
  });

  it("does not let a user grant themselves a role in someone else's tenant", async () => {
    await expect(
      runAsTenant(prisma, { userId: ownerB }, (tx) =>
        tx.businessMember.create({
          data: { businessId: tenantA, userId: ownerB, role: 'OWNER' },
        }),
      ),
    ).rejects.toThrow();
  });

  it('refuses a raw insert that names another tenant (RLS alone, no extension)', async () => {
    // Deliberately bypasses runAsTenant's scoping: `applyTenantContext` sets the context
    // and nothing rewrites the payload. This is the only way to prove that the database
    // itself refuses the write, rather than the application-level extension covering for
    // it. The next test shows the extension doing that covering.
    await expect(
      prisma.$transaction(async (tx) => {
        await applyTenantContext(tx, { businessId: tenantA, userId: ownerA });

        return tx.auditLog.create({
          data: {
            businessId: tenantB,
            actorType: 'USER',
            action: 'isolation.probe',
            entityType: 'Business',
          },
        });
      }),
    ).rejects.toThrow();
  });

  it('stamps the tenant onto writes even when the caller names another one', async () => {
    // What scopeToTenant adds on top of RLS: a payload cannot claim another tenant,
    // because the extension overwrites `businessId` with the context value before the
    // query is built. The assertion above proves RLS would refuse it regardless.
    const written = await runAsTenant(prisma, { businessId: tenantA, userId: ownerA }, (tx) =>
      tx.auditLog.create({
        data: {
          businessId: tenantB,
          actorType: 'USER',
          action: 'isolation.stamped',
          entityType: 'Business',
        },
      }),
    );

    expect(written.businessId).toBe(tenantA);
  });

  it("makes the audit trail immutable, even for a tenant's own rows", async () => {
    const before = await runAsTenant(prisma, { businessId: tenantA }, (tx) =>
      tx.auditLog.findMany({ where: { action: 'isolation.stamped' }, select: { id: true } }),
    );

    const entryId = before[0]?.id;
    expect(entryId).toBeDefined();

    const updated = await runAsTenant(prisma, { businessId: tenantA, userId: ownerA }, (tx) =>
      tx.auditLog.updateMany({ where: { id: entryId }, data: { action: 'tampered' } }),
    );
    const deleted = await runAsTenant(prisma, { businessId: tenantA, userId: ownerA }, (tx) =>
      tx.auditLog.deleteMany({ where: { id: entryId } }),
    );

    expect(updated.count).toBe(0);
    expect(deleted.count).toBe(0);

    const after = await runAsTenant(prisma, { businessId: tenantA }, (tx) =>
      tx.auditLog.findMany({ where: { action: 'isolation.stamped' }, select: { id: true } }),
    );

    expect(after).toEqual(before);
  });

  it('makes the stock ledger append-only too', async () => {
    // Non-vacuous on purpose: a row is created first, so "nothing changed" cannot be
    // satisfied merely because the table was empty.
    const movementId = await runAsTenant(
      prisma,
      { businessId: tenantA, userId: ownerA },
      async (tx) => {
        const location = await tx.stockLocation.create({
          data: { businessId: tenantA, name: `Entrepôt ${suffix}` },
        });

        const product = await tx.product.create({
          data: {
            businessId: tenantA,
            sku: `SKU-${suffix}`,
            slug: `probe-${suffix}`,
            name: 'Produit sonde',
            price: '1.00',
          },
        });

        const movement = await tx.stockMovement.create({
          data: {
            businessId: tenantA,
            locationId: location.id,
            productId: product.id,
            reason: 'PURCHASE',
            quantityDelta: '5.000',
            quantityAfter: '5.000',
          },
        });

        return movement.id;
      },
    );

    const updated = await runAsTenant(prisma, { businessId: tenantA, userId: ownerA }, (tx) =>
      tx.stockMovement.updateMany({ where: { id: movementId }, data: { quantityDelta: '99.000' } }),
    );
    const deleted = await runAsTenant(prisma, { businessId: tenantA, userId: ownerA }, (tx) =>
      tx.stockMovement.deleteMany({ where: { id: movementId } }),
    );

    expect(updated.count).toBe(0);
    expect(deleted.count).toBe(0);

    const remaining = await runAsTenant(prisma, { businessId: tenantA }, (tx) =>
      tx.stockMovement.findMany({ where: { id: movementId }, select: { quantityDelta: true } }),
    );

    expect(remaining).toHaveLength(1);
    // Still the original value, not 99.
    expect(remaining[0]?.quantityDelta.toString()).toBe('5');
  });

  it('scopes unique constraints per tenant', async () => {
    // The claim the whole schema rests on: unique keys are tenant-inclusive, so two businesses
    // may use the same SKU. This was asserted in the plan's test list from the start and, until
    // now, never actually exercised.
    const sku = `SHARED-${suffix}`;

    const inA = await runAsTenant(prisma, { businessId: tenantA, userId: ownerA }, (tx) =>
      tx.product.create({
        data: { businessId: tenantA, sku, slug: `shared-a-${suffix}`, name: 'Partagé', price: '1.00' },
      }),
    );
    const inB = await runAsTenant(prisma, { businessId: tenantB, userId: ownerB }, (tx) =>
      tx.product.create({
        data: { businessId: tenantB, sku, slug: `shared-b-${suffix}`, name: 'Partagé', price: '1.00' },
      }),
    );

    expect(inA.sku).toBe(sku);
    expect(inB.sku).toBe(sku);

    // The same SKU twice inside ONE tenant is refused — which is what makes the constraint
    // meaningful rather than merely absent.
    await expect(
      runAsTenant(prisma, { businessId: tenantA, userId: ownerA }, (tx) =>
        tx.product.create({
          data: {
            businessId: tenantA,
            sku,
            slug: `shared-a2-${suffix}`,
            name: 'Doublon',
            price: '1.00',
          },
        }),
      ),
    ).rejects.toThrow();

    // And a second open till session on the same location is refused, because that uniqueness
    // rests on a partial index rather than a key Prisma declares. One has to be open first —
    // which is what the first statement here establishes.
    const locationId = (
      await runAsTenant(prisma, { businessId: tenantA }, (tx) =>
        tx.stockLocation.findFirst({ where: { name: `Entrepôt ${suffix}` }, select: { id: true } }),
      )
    )?.id;

    expect(locationId).toBeDefined();

    await runAsTenant(prisma, { businessId: tenantA, userId: ownerA }, (tx) =>
      tx.posSession.create({
        data: {
          businessId: tenantA,
          locationId: locationId as string,
          openedById: ownerA,
          openedAt: new Date(),
          openingFloat: '50.00',
          status: 'OPEN',
        },
      }),
    );

    await expect(
      runAsTenant(prisma, { businessId: tenantA, userId: ownerA }, (tx) =>
        tx.posSession.create({
          data: {
            businessId: tenantA,
            locationId: locationId as string,
            openedById: ownerA,
            openedAt: new Date(),
            openingFloat: '25.00',
            status: 'OPEN',
          },
        }),
      ),
    ).rejects.toThrow();
  });

  it('has row-level security enabled on every table carrying a business_id', async () => {
    // The guard for the twelve domains still to come: a migration that adds a tenant
    // table and forgets ENABLE ROW LEVEL SECURITY fails here, not in production.
    //
    // `session` is the one documented exception. It records which tenant a signed-in
    // device is currently acting in, so it references a business — but it is a
    // platform-level table, read while authenticating, before any tenant context exists.
    // Putting it under RLS would make signing in impossible. Every other table with a
    // business_id is tenant-owned and must be protected.
    const unprotected = await prisma.$queryRaw<{ table_name: string }[]>`
      SELECT c.relname AS table_name
      FROM information_schema.columns col
      JOIN pg_class c ON c.relname = col.table_name
      JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = col.table_schema
      WHERE col.table_schema = 'public'
        AND col.column_name = 'business_id'
        AND c.relkind = 'r'
        AND c.relname <> 'session'
        AND (c.relrowsecurity = false OR c.relforcerowsecurity = false)`;

    expect(unprotected).toEqual([]);
  });
});
