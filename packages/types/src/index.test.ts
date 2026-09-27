import { describe, expect, it } from 'vitest';

import {
  BUSINESS_CATEGORIES,
  CLIENT_CATEGORIES,
  PARTNER_CATEGORIES,
  dashboardPathFor,
  isBusinessCategory,
  isClientCategory,
  isPartnerCategory,
  type BusinessCategory,
} from './index.js';

describe('business categories', () => {
  it('ships exactly ten dashboards, as recorded in the plan (§4.4)', () => {
    expect(BUSINESS_CATEGORIES).toHaveLength(10);
    expect(CLIENT_CATEGORIES).toHaveLength(7);
    expect(PARTNER_CATEGORIES).toHaveLength(3);
  });

  it('exposes the merged grocery/fruit category and the new shop category (B.8, B.9)', () => {
    expect(CLIENT_CATEGORIES).toContain('epiceries-fruiteries');
    expect(CLIENT_CATEGORIES).toContain('boutiques-supermarche');
    // The pre-merge categories must not survive: they would split the dashboard again.
    expect(CLIENT_CATEGORIES as readonly string[]).not.toContain('epiceries');
    expect(CLIENT_CATEGORIES as readonly string[]).not.toContain('fruiteries');
  });
});

describe('dashboardPathFor', () => {
  it('returns a /dashboard/<slug> route for every category', () => {
    for (const category of BUSINESS_CATEGORIES) {
      expect(dashboardPathFor(category)).toBe(`/dashboard/${category}`);
    }
  });

  it('never returns a duplicate route', () => {
    const paths = BUSINESS_CATEGORIES.map((category) => dashboardPathFor(category));
    expect(new Set(paths).size).toBe(BUSINESS_CATEGORIES.length);
  });
});

describe('narrowing helpers', () => {
  it('accepts every declared category', () => {
    for (const category of BUSINESS_CATEGORIES) {
      expect(isBusinessCategory(category)).toBe(true);
    }
  });

  it('rejects anything that is not a declared category', () => {
    for (const value of ['', 'restaurants-fastfood', 'epicerie', 'admin', 'SUPERADMIN']) {
      expect(isBusinessCategory(value)).toBe(false);
    }
  });

  it('separates client categories from partner profiles', () => {
    expect(isClientCategory('restaurant')).toBe(true);
    expect(isClientCategory('livreur')).toBe(false);
    expect(isPartnerCategory('livreur')).toBe(true);
    expect(isPartnerCategory('catering')).toBe(false);
  });

  it('narrows the type so it can be passed straight to dashboardPathFor', () => {
    const value: string = 'catering';
    if (!isBusinessCategory(value)) throw new Error('expected a business category');

    // If the guard did not narrow, this would not compile.
    const category: BusinessCategory = value;
    expect(dashboardPathFor(category)).toBe('/dashboard/catering');
  });
});
