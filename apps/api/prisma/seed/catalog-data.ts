/**
 * Demo catalogue data — what each seeded business sells.
 *
 * Kept as plain data, separate from the writes that persist it, for two reasons: the
 * shapes are readable at a glance, and a unit test can assert invariants (unique SKUs,
 * known categories, decimal-formatted prices) without touching a database.
 *
 * The catalogues deliberately differ per business type. A bar's menu has nothing in common
 * with a delivery company's rate card, and seeding every tenant with the same five products
 * would make every dashboard look like a copy of the same demo — hiding exactly the bugs
 * that per-category work produces.
 */

import type { DemoCatalog } from './catalog-types.js';

/** Food service: portions, a kitchen, a cooking modifier. */
const RESTAURANT: DemoCatalog = {
  categories: [
    {
      name: 'Entrées',
      slug: 'entrees',
      products: [
        { sku: 'ENT-001', name: 'Salade de gombos', price: '5.50', vatRate: '10', costPrice: '1.80', isPublished: true },
        { sku: 'ENT-002', name: 'Beignets de crevettes', price: '6.00', vatRate: '10', costPrice: '2.20', isPublished: true },
      ],
    },
    {
      name: 'Plats',
      slug: 'plats',
      products: [
        { sku: 'PLAT-001', name: 'Poulet braisé', price: '12.50', vatRate: '10', costPrice: '4.90', isPublished: true },
        { sku: 'PLAT-002', name: 'Poisson grillé', price: '14.00', vatRate: '10', costPrice: '6.10', isPublished: true },
        { sku: 'PLAT-003', name: 'Riz sauce arachide', price: '9.00', vatRate: '10', costPrice: '2.70', isPublished: true },
      ],
    },
    {
      name: 'Boissons',
      slug: 'boissons',
      products: [
        { sku: 'BOIS-001', name: 'Jus de bissap', price: '3.00', vatRate: '10', costPrice: '0.80', isPublished: true },
        { sku: 'BOIS-002', name: 'Eau minérale 50cl', price: '1.50', vatRate: '5.5', costPrice: '0.45', isPublished: true },
      ],
    },
  ],
  ingredients: [
    { name: 'Poulet entier', unit: 'KILOGRAM', costPerUnit: '5.40' },
    { name: 'Riz', unit: 'KILOGRAM', costPerUnit: '1.20' },
    { name: 'Huile d’arachide', unit: 'LITRE', costPerUnit: '2.30' },
    { name: 'Oignons', unit: 'KILOGRAM', costPerUnit: '0.90' },
  ],
  recipe: {
    productSku: 'PLAT-003',
    yieldQuantity: '4',
    yieldUnit: 'PORTION',
    lines: [
      { ingredient: 'Riz', quantity: '0.400', unit: 'KILOGRAM' },
      { ingredient: 'Oignons', quantity: '0.150', unit: 'KILOGRAM' },
      { ingredient: 'Huile d’arachide', quantity: '0.080', unit: 'LITRE' },
    ],
  },
  modifierGroup: {
    name: 'Cuisson',
    minSelections: 1,
    maxSelections: 1,
    attachedTo: 'PLAT-002',
    modifiers: [
      { name: 'Saignant', priceDelta: '0.00' },
      { name: 'À point', priceDelta: '0.00' },
      { name: 'Bien cuit', priceDelta: '0.00' },
    ],
  },
};

/** Traiteur: trays and per-person buffets, plus services that carry no stock. */
const CATERING: DemoCatalog = {
  categories: [
    {
      name: 'Plateaux',
      slug: 'plateaux',
      products: [
        { sku: 'PLA-001', name: 'Plateau sandwichs (20 pers.)', price: '95.00', unit: 'BOX', vatRate: '10', costPrice: '42.00', isPublished: true },
        { sku: 'PLA-002', name: 'Plateau de fruits (20 pers.)', price: '80.00', unit: 'BOX', vatRate: '10', costPrice: '34.00', isPublished: true },
      ],
    },
    {
      name: 'Buffets',
      slug: 'buffets',
      products: [
        { sku: 'BUF-001', name: 'Buffet froid', price: '24.00', unit: 'PORTION', vatRate: '10', costPrice: '9.50', isPublished: true },
        { sku: 'BUF-002', name: 'Buffet chaud', price: '29.00', unit: 'PORTION', vatRate: '10', costPrice: '12.00', isPublished: true },
      ],
    },
    {
      name: 'Services',
      slug: 'services',
      products: [
        { sku: 'SVC-001', name: 'Service en salle (serveur)', price: '180.00', vatRate: '20', costPrice: '120.00', trackStock: false, isPublished: true },
        { sku: 'SVC-002', name: 'Location vaisselle', price: '60.00', vatRate: '20', costPrice: '15.00', trackStock: false, isPublished: true },
      ],
    },
  ],
};

/** Boutique / supérette: retail shelf goods, some sold by weight. */
const SHOP: DemoCatalog = {
  categories: [
    {
      name: 'Épicerie',
      slug: 'epicerie',
      products: [
        { sku: 'EPI-001', name: 'Lait entier 1L', price: '1.25', vatRate: '5.5', costPrice: '0.85', isPublished: true },
        { sku: 'EPI-002', name: 'Pâtes 500g', price: '1.10', vatRate: '5.5', costPrice: '0.70', isPublished: true },
        { sku: 'EPI-003', name: 'Sucre 1kg', price: '1.45', vatRate: '5.5', costPrice: '1.00', isPublished: true },
      ],
    },
    {
      name: 'Produits frais',
      slug: 'produits-frais',
      products: [
        { sku: 'FRA-001', name: 'Tomates', price: '2.90', unit: 'KILOGRAM', vatRate: '5.5', costPrice: '1.60', isPublished: true },
        { sku: 'FRA-002', name: 'Fromage râpé 200g', price: '2.60', vatRate: '5.5', costPrice: '1.70', isPublished: true },
      ],
    },
    {
      name: 'Hygiène',
      slug: 'hygiene',
      products: [
        { sku: 'HYG-001', name: 'Savon liquide 500ml', price: '2.10', vatRate: '20', costPrice: '1.05', isPublished: true },
      ],
    },
  ],
};

/** Épicerie / fruiterie: mostly weight-sold produce, plus a basket. */
const GROCERY: DemoCatalog = {
  categories: [
    {
      name: 'Fruits',
      slug: 'fruits',
      products: [
        { sku: 'FRU-001', name: 'Mangues', price: '1.80', unit: 'KILOGRAM', vatRate: '5.5', costPrice: '0.90', isPublished: true },
        { sku: 'FRU-002', name: 'Oranges', price: '1.40', unit: 'KILOGRAM', vatRate: '5.5', costPrice: '0.70', isPublished: true },
      ],
    },
    {
      name: 'Légumes',
      slug: 'legumes',
      products: [
        { sku: 'LEG-001', name: 'Carottes', price: '1.10', unit: 'KILOGRAM', vatRate: '5.5', costPrice: '0.55', isPublished: true },
        { sku: 'LEG-002', name: 'Oignons', price: '0.95', unit: 'KILOGRAM', vatRate: '5.5', costPrice: '0.48', isPublished: true },
      ],
    },
    {
      name: 'Paniers',
      slug: 'paniers',
      products: [
        { sku: 'PAN-001', name: 'Panier familial 5kg', price: '12.00', unit: 'BOX', vatRate: '5.5', costPrice: '6.50', isPublished: true },
      ],
    },
  ],
};

/**
 * Partner profiles sell services, not goods.
 *
 * `trackStock: false` throughout: a delivery has no shelf quantity, and seeding stock rows
 * for it would produce an inventory screen full of meaningless zeroes.
 */
const DRIVER: DemoCatalog = {
  categories: [
    {
      name: 'Courses',
      slug: 'courses',
      products: [
        { sku: 'LIV-001', name: 'Course courte (ville)', price: '3.50', vatRate: '20', trackStock: false, isPublished: true },
        { sku: 'LIV-002', name: 'Course longue (hors ville)', price: '7.50', vatRate: '20', trackStock: false, isPublished: true },
      ],
    },
    {
      name: 'Options',
      slug: 'options',
      products: [
        { sku: 'LIV-003', name: 'Livraison express', price: '4.00', vatRate: '20', trackStock: false, isPublished: true },
      ],
    },
  ],
};

const DELIVERY_COMPANY: DemoCatalog = {
  categories: [
    {
      name: 'Livraisons',
      slug: 'livraisons',
      products: [
        { sku: 'EXP-001', name: 'Livraison standard', price: '6.00', vatRate: '20', trackStock: false, isPublished: true },
        { sku: 'EXP-002', name: 'Livraison sous 2h', price: '11.00', vatRate: '20', trackStock: false, isPublished: true },
      ],
    },
    {
      name: 'Logistique',
      slug: 'logistique',
      products: [
        { sku: 'EXP-003', name: 'Entreposage (palette / mois)', price: '45.00', vatRate: '20', trackStock: false, isPublished: true },
      ],
    },
  ],
};

const AFFILIATE: DemoCatalog = {
  categories: [
    {
      name: 'Packs partenaires',
      slug: 'packs-partenaires',
      products: [
        { sku: 'AFF-001', name: 'Pack présence réseaux sociaux', price: '150.00', vatRate: '20', trackStock: false, isPublished: true },
        { sku: 'AFF-002', name: 'Pack vidéo courte', price: '220.00', vatRate: '20', trackStock: false, isPublished: true },
      ],
    },
  ],
};

/** Keyed by BusinessType key. A category with no entry simply gets no demo catalogue. */
export const DEMO_CATALOGS: Readonly<Record<string, DemoCatalog>> = {
  restaurant: RESTAURANT,
  catering: CATERING,
  'boutiques-supermarche': SHOP,
  'epiceries-fruiteries': GROCERY,
  livreur: DRIVER,
  'societe-livraison': DELIVERY_COMPANY,
  affilie: AFFILIATE,
};
