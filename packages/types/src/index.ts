/**
 * @chapfoody/types — domain vocabulary shared by the API and every frontend surface.
 *
 * The category list and the dashboard route map below are the SINGLE SOURCE OF
 * TRUTH introduced by the implementation plan:
 *   - route map      → guidelines/ImplementationPlan.md section 4.4
 *   - category merge → requirement B.8 (épiceries + fruiteries merged)
 *   - new dashboard  → requirement B.9 (boutiques / supérettes / supermarché)
 *
 * Everything that needs to know "which dashboards exist" — the onboarding
 * wizard (M6), the sidebar configuration factory (M7), the admin plan builder
 * (M10) — reads it from here rather than redefining a list.
 */

/* ────────────────────────────────────────────────────────────────────────────
 * Categories requiring a client dashboard
 * (requirement: “Clients: restaurants, grocery stores, shops”)
 * ──────────────────────────────────────────────────────────────────────────── */

export const CLIENT_CATEGORIES = [
  'restaurant',
  'bars-maquis',
  'metiers-de-bouche',
  'epiceries-fruiteries',
  'boutiques-supermarche',
  'producteurs-distributeurs',
  'catering',
] as const;

export type ClientCategory = (typeof CLIENT_CATEGORIES)[number];

/* ────────────────────────────────────────────────────────────────────────────
 * Partner profiles — separate dashboards, not part of the “Clients” user type
 * (requirement A.V: “Independent delivery guys, Delivery companies,
 * Marketing Affiliates”)
 * ──────────────────────────────────────────────────────────────────────────── */

export const PARTNER_CATEGORIES = ['livreur', 'societe-livraison', 'affilie'] as const;

export type PartnerCategory = (typeof PARTNER_CATEGORIES)[number];

/** Every dashboard the platform ships (ten in total). */
export const BUSINESS_CATEGORIES = [...CLIENT_CATEGORIES, ...PARTNER_CATEGORIES] as const;

export type BusinessCategory = ClientCategory | PartnerCategory;

/* ────────────────────────────────────────────────────────────────────────────
 * Dashboard route map — one route per dashboard (requirement B.5)
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Declared as an explicit record rather than built with string interpolation:
 * moving a dashboard route then becomes a deliberate, reviewable change that the
 * compiler enforces across every consumer.
 */
const DASHBOARD_PATHS: Record<BusinessCategory, string> = {
  restaurant: '/dashboard/restaurant',
  'bars-maquis': '/dashboard/bars-maquis',
  'metiers-de-bouche': '/dashboard/metiers-de-bouche',
  'epiceries-fruiteries': '/dashboard/epiceries-fruiteries',
  'boutiques-supermarche': '/dashboard/boutiques-supermarche',
  'producteurs-distributeurs': '/dashboard/producteurs-distributeurs',
  catering: '/dashboard/catering',
  livreur: '/dashboard/livreur',
  'societe-livraison': '/dashboard/societe-livraison',
  affilie: '/dashboard/affilie',
};

/** Base route of the dashboard a category belongs to. */
export function dashboardPathFor(category: BusinessCategory): string {
  return DASHBOARD_PATHS[category];
}

/* ────────────────────────────────────────────────────────────────────────────
 * Narrowing helpers — used when validating values coming from the API, a URL
 * parameter or persisted state.
 * ──────────────────────────────────────────────────────────────────────────── */

export function isBusinessCategory(value: string): value is BusinessCategory {
  return (BUSINESS_CATEGORIES as readonly string[]).includes(value);
}

export function isClientCategory(value: string): value is ClientCategory {
  return (CLIENT_CATEGORIES as readonly string[]).includes(value);
}

export function isPartnerCategory(value: string): value is PartnerCategory {
  return (PARTNER_CATEGORIES as readonly string[]).includes(value);
}

/* ────────────────────────────────────────────────────────────────────────────
 * Roles (RBAC) — enforced server-side by RolesGuard (M3)
 * ──────────────────────────────────────────────────────────────────────────── */

export const USER_ROLES = [
  'SUPER_ADMIN',
  'OWNER',
  'MANAGER',
  'CASHIER',
  'VENDOR',
  'ACCOUNTANT',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

/** Roles that can be attached to a client (business-scoped) account. */
export const BUSINESS_ROLES: readonly UserRole[] = [
  'OWNER',
  'MANAGER',
  'CASHIER',
  'VENDOR',
  'ACCOUNTANT',
];
