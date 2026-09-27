/**
 * The premium feature registry.
 *
 * A `Feature.key` is a contract shared by three consumers: the API's
 * `@RequiresFeature('…')` decorator, the business's resolved `Entitlement` rows, and the
 * frontend's premium gate. Dotted keys, kebab-case segments (implementation plan §7.1).
 *
 * Each entry declares its inclusion per plan, in Free / Standard / Premium order:
 *   `false`  → not included
 *   `true`   → included, no allowance (a flag)
 *   number   → included, metered up to that allowance (a quota)
 *
 * `kind` is derived rather than declared: a feature whose plans only ever say
 * `true`/`false` is a FLAG, and one that names a number anywhere is a QUOTA. Declaring
 * both separately would allow a QUOTA feature with no quota anywhere — exactly the
 * inconsistency the derived form makes impossible.
 *
 * Completing this list against every `isPremium` flag in the original requirements is
 * M10's admin plan builder. The shape is settled here so later work only adds rows.
 */

export type PlanKey = 'free' | 'standard' | 'premium';

/** A feature's inclusion in one plan. */
export type PlanInclusion = boolean | number;

export interface FeatureSeed {
  readonly key: string;
  readonly labelFr: string;
  readonly labelEn: string;
  readonly category: string;
  readonly kind: 'FLAG' | 'QUOTA';
  readonly quotaUnit: string | null;
  /** BusinessType keys this applies to. Empty = every category. */
  readonly appliesToCategories: readonly string[];
  readonly sortOrder: number;
  readonly plans: Readonly<Record<PlanKey, PlanInclusion>>;
}

/** Categories with a kitchen, where ingredients and recipes mean something. */
const KITCHEN = ['restaurant', 'bars-maquis', 'metiers-de-bouche', 'catering'] as const;

/** Categories that seat guests. */
const TABLE_SERVICE = ['restaurant', 'bars-maquis'] as const;

/** Partner profiles: the delivery side of the platform. */
const DELIVERY_SIDE = ['livreur', 'societe-livraison'] as const;

interface FeatureOptions {
  readonly quotaUnit?: string;
  readonly categories?: readonly string[];
}

function feature(
  key: string,
  labelFr: string,
  labelEn: string,
  category: string,
  plans: readonly [PlanInclusion, PlanInclusion, PlanInclusion],
  options: FeatureOptions = {},
): FeatureSeed {
  const [free, standard, premium] = plans;
  const metered = [free, standard, premium].some((value) => typeof value === 'number');

  return {
    key,
    labelFr,
    labelEn,
    category,
    kind: metered ? 'QUOTA' : 'FLAG',
    quotaUnit: options.quotaUnit ?? null,
    appliesToCategories: options.categories ?? [],
    sortOrder: 0, // assigned from the array position below
    plans: { free, standard, premium },
  };
}

/**
 * Order matters: `sortOrder` is taken from the position, so the pricing page and the
 * admin plan builder list features in the order they read here — one place to change.
 */
export const FEATURES: readonly FeatureSeed[] = [
  // Catalogue
  feature('catalog.products', 'Produits', 'Products', 'catalog', [true, true, true]),
  feature('catalog.categories', 'Catégories', 'Categories', 'catalog', [true, true, true]),
  feature('catalog.variants', 'Variantes', 'Variants', 'catalog', [false, true, true]),
  feature('catalog.ingredients', 'Ingrédients & allergènes', 'Ingredients & allergens', 'catalog', [false, true, true], { categories: KITCHEN }),
  feature('catalog.recipes', 'Fiches recettes', 'Recipes', 'catalog', [false, 20, 500], { quotaUnit: 'recipes', categories: KITCHEN }),

  // Stock
  feature('inventory.stock', 'Suivi du stock', 'Stock tracking', 'inventory', [true, true, true]),
  feature('inventory.suppliers', 'Fournisseurs', 'Suppliers', 'inventory', [false, true, true]),
  feature('inventory.purchase-orders', 'Bons de commande', 'Purchase orders', 'inventory', [false, true, true]),
  feature('inventory.stock-counts', 'Inventaires', 'Stock counts', 'inventory', [false, false, true]),

  // Ventes et caisse
  feature('sales.pos', 'Caisse', 'Point of sale', 'sales', [true, true, true]),
  feature('sales.tables', 'Plan de salle', 'Table map', 'sales', [false, true, true], { categories: TABLE_SERVICE }),
  feature('sales.reservations', 'Réservations', 'Reservations', 'sales', [false, false, true], { categories: TABLE_SERVICE }),
  feature('sales.delivery-orders', 'Commandes en livraison', 'Delivery orders', 'sales', [false, true, true]),
  feature('sales.multi-cashier', 'Plusieurs caissiers', 'Multiple cashiers', 'sales', [false, false, true]),

  // Comptabilité
  feature('accounting.journal', 'Journal comptable', 'Accounting journal', 'accounting', [false, true, true]),
  feature('accounting.vat-returns', 'Déclarations de TVA', 'VAT returns', 'accounting', [false, false, true]),
  feature('accounting.exports', 'Exports comptables', 'Accounting exports', 'accounting', [false, true, true]),

  // Ressources humaines
  feature('hr.employees', 'Employés', 'Employees', 'hr', [false, 10, 100], { quotaUnit: 'employees' }),
  feature('hr.shifts', 'Planning et pointages', 'Shifts and time tracking', 'hr', [false, true, true]),
  feature('hr.payroll', 'Paie', 'Payroll', 'hr', [false, false, true]),

  // Vendeurs
  feature('vendors.management', 'Gestion des vendeurs', 'Vendor management', 'vendors', [false, 5, 50], { quotaUnit: 'vendors' }),
  feature('vendors.commissions', 'Commissions vendeurs', 'Vendor commissions', 'vendors', [false, false, true]),

  // Livraison
  feature('delivery.zones', 'Zones de livraison', 'Delivery zones', 'delivery', [false, true, true], { categories: DELIVERY_SIDE }),
  feature('delivery.drivers', 'Gestion des livreurs', 'Driver management', 'delivery', [false, 5, 100], { quotaUnit: 'drivers', categories: DELIVERY_SIDE }),
  feature('delivery.tracking', 'Suivi en temps réel', 'Live tracking', 'delivery', [false, true, true], { categories: DELIVERY_SIDE }),

  // Affiliation
  feature('affiliate.program', 'Programme d’affiliation', 'Affiliate programme', 'affiliate', [false, false, true]),
  feature('affiliate.commissions', 'Commissions et reversements', 'Commissions and payouts', 'affiliate', [false, false, true]),

  // Marketing
  feature('marketing.campaigns', 'Campagnes', 'Campaigns', 'marketing', [false, true, true]),
  feature('marketing.sms', 'SMS', 'SMS', 'marketing', [false, 200, 5000], { quotaUnit: 'sms.sent' }),
  feature('marketing.email', 'E-mails', 'Emails', 'marketing', [false, 1000, 20000], { quotaUnit: 'email.sent' }),
  feature('marketing.loyalty', 'Fidélité', 'Loyalty', 'marketing', [false, false, true]),
  feature('marketing.automations', 'Automatisations', 'Automations', 'marketing', [false, false, true]),

  // Site vitrine
  feature('storefront.public-site', 'Site vitrine', 'Public website', 'storefront', [true, true, true]),
  feature('storefront.pages', 'Pages du site', 'Website pages', 'storefront', [3, 10, 100], { quotaUnit: 'pages' }),
  feature('storefront.checkout-online', 'Commande en ligne', 'Online checkout', 'storefront', [false, true, true]),
  feature('storefront.custom-domain', 'Nom de domaine', 'Custom domain', 'storefront', [false, false, true]),

  // Rapports
  feature('reports.sales', 'Rapport des ventes', 'Sales report', 'reports', [true, true, true]),
  feature('reports.advanced', 'Analyses avancées', 'Advanced analytics', 'reports', [false, false, true]),
  feature('reports.exports', 'Exports de rapports', 'Report exports', 'reports', [false, true, true]),
].map((entry, index) => ({ ...entry, sortOrder: index }));
