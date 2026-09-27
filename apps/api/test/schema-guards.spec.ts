import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { BUSINESS_CATEGORIES, USER_ROLES } from '@chapfoody/types';

import { TENANT_SCOPED_MODELS } from '../src/infra/prisma/tenant-context.js';
import { ACCOUNTS } from '../prisma/seed/accounts.js';
import { FEATURES } from '../prisma/seed/features.js';
import { BUSINESS_TYPES, PLANS } from '../prisma/seed/plans.js';

/**
 * Guards that hold the schema, the seed and the shared vocabulary together.
 *
 * These do not need a database, which is the point: they run on every commit, so a
 * mismatch is caught while it is still a one-line fix rather than at runtime on a
 * dashboard nobody tested.
 */

const SCHEMA_DIR = join(__dirname, '..', 'prisma', 'models');

/**
 * Models that declare a `businessId`, read straight from the schema files.
 *
 * Parsed rather than derived from the generated client so the check stays honest: it
 * compares the source of truth against the hand-written list in tenant-context.ts.
 */
function modelsWithBusinessId(): string[] {
  const found: string[] = [];

  for (const file of readdirSync(SCHEMA_DIR).filter((name) => name.endsWith('.prisma'))) {
    const source = readFileSync(join(SCHEMA_DIR, file), 'utf8');

    // Model bodies contain no nested braces (only parentheses and brackets in
    // attributes), so a non-greedy match to the closing brace is exact.
    for (const match of source.matchAll(/model\s+(\w+)\s*\{([\s\S]*?)\n\}/g)) {
      const [, name, body] = match;

      if (name !== undefined && /^\s*businessId\s+String\b/m.test(body ?? '')) {
        found.push(name);
      }
    }
  }

  return found.sort();
}

describe('tenant scoping', () => {
  it('lists every model carrying a businessId, and nothing else', () => {
    // Session is the documented exception: it records which tenant a signed-in device is
    // acting in (so it holds a businessId) but it is a platform-level table, read while
    // authenticating, before any tenant context exists. The integration suite excludes it
    // from the row-level security check for the same reason.
    const expected = modelsWithBusinessId().filter((name) => name !== 'Session');

    expect(expected).toEqual([...TENANT_SCOPED_MODELS].sort());
  });

  it('never scopes Business, which has no businessId of its own', () => {
    // Business's own id IS the tenant. Injecting `{ businessId }` into its filters would
    // reference a field that does not exist.
    expect(modelsWithBusinessId()).not.toContain('Business');
    expect(TENANT_SCOPED_MODELS.has('Business')).toBe(false);
  });
});

describe('seed data', () => {
  it('mirrors the shared category list exactly', () => {
    expect(BUSINESS_TYPES.map((type) => type.key)).toEqual([...BUSINESS_CATEGORIES]);
  });

  it('uses only role values the shared vocabulary knows', () => {
    for (const account of ACCOUNTS) {
      expect(USER_ROLES).toContain(account.role);
    }
  });

  it('has the eight documented accounts, one platform and seven clients', () => {
    expect(ACCOUNTS).toHaveLength(8);
    expect(ACCOUNTS.filter((account) => account.business === null)).toHaveLength(1);
    expect(ACCOUNTS.filter((account) => account.role === 'SUPER_ADMIN')).toHaveLength(1);
  });

  it('points every account at a real category and a real plan', () => {
    const categoryKeys = new Set(BUSINESS_TYPES.map((type) => type.key));
    const planKeys = new Set(PLANS.map((plan) => plan.key));

    for (const account of ACCOUNTS) {
      if (account.business === null) {
        continue;
      }

      expect(categoryKeys).toContain(account.business.category);
      expect(planKeys).toContain(account.business.planKey);
    }
  });

  it('gives every business a distinct slug and every account a distinct email', () => {
    expect(new Set(ACCOUNTS.map((account) => account.email)).size).toBe(ACCOUNTS.length);

    const slugs = ACCOUNTS.flatMap((account) =>
      account.business === null ? [] : [account.business.slug],
    );

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('keeps the three plans and states every feature\'s inclusion in all of them', () => {
    expect(PLANS.map((plan) => plan.key)).toEqual(['free', 'standard', 'premium']);

    for (const feature of FEATURES) {
      expect(Object.keys(feature.plans).sort()).toEqual(['free', 'premium', 'standard']);
    }
  });

  it('uses unique dotted feature keys, kebab-case after the domain', () => {
    const keys = FEATURES.map((feature) => feature.key);

    expect(new Set(keys).size).toBe(keys.length);

    for (const key of keys) {
      expect(key).toMatch(/^[a-z]+(\.[a-z][a-z0-9-]*)+$/);
    }
  });

  it('gives every metered feature a unit to meter', () => {
    for (const feature of FEATURES) {
      if (feature.kind === 'QUOTA') {
        expect(feature.quotaUnit).not.toBeNull();
      } else {
        expect(feature.quotaUnit).toBeNull();
      }
    }
  });

  it('restricts category-specific features to real categories', () => {
    const categoryKeys = new Set(BUSINESS_TYPES.map((type) => type.key));

    for (const feature of FEATURES) {
      for (const category of feature.appliesToCategories) {
        expect(categoryKeys).toContain(category);
      }
    }
  });

  it('offers at least one feature on the free plan and withholds some for premium', () => {
    const onFree = FEATURES.filter((feature) => feature.plans.free !== false);
    const premiumOnly = FEATURES.filter(
      (feature) => feature.plans.free === false && feature.plans.premium !== false,
    );

    expect(onFree.length).toBeGreaterThan(0);
    expect(premiumOnly.length).toBeGreaterThan(0);
  });
});
