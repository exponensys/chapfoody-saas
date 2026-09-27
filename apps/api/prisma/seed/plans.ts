/**
 * Plans and the ten dashboards.
 *
 * ── A known limitation, recorded rather than hidden ──────────────────────────
 * A plan carries ONE price and ONE currency. Businesses trade in EUR and XOF today, so
 * an XOF tenant currently sees a euro price. Per-currency pricing is part of the admin
 * plan builder (M10); modelling it now would mean guessing at a shape the pricing page
 * has not settled yet.
 */

import type { PlanKey } from './features.js';

export interface BusinessTypeSeed {
  /** Slug used by the frontend routes and by @chapfoody/types. */
  readonly key: string;
  readonly labelFr: string;
  readonly labelEn: string;
  readonly icon: string;
  /** True for the seven client categories, false for the three partner profiles. */
  readonly isClientCategory: boolean;
}

/**
 * Mirrors BUSINESS_CATEGORIES in @chapfoody/types. A unit test asserts the two lists are
 * equal, because a category the frontend routes on but the database does not know about
 * would fail only at runtime, in production, on the one dashboard nobody tested.
 */
export const BUSINESS_TYPES: readonly BusinessTypeSeed[] = [
  { key: 'restaurant', labelFr: 'Restaurant', labelEn: 'Restaurant', icon: 'utensils', isClientCategory: true },
  { key: 'bars-maquis', labelFr: 'Bars & Maquis', labelEn: 'Bars & Maquis', icon: 'beer', isClientCategory: true },
  { key: 'metiers-de-bouche', labelFr: 'Métiers de bouche', labelEn: 'Food trades', icon: 'chef-hat', isClientCategory: true },
  { key: 'epiceries-fruiteries', labelFr: 'Épiceries & Fruiteries', labelEn: 'Grocery & fruit shops', icon: 'shopping-basket', isClientCategory: true },
  { key: 'boutiques-supermarche', labelFr: 'Boutiques & Supermarchés', labelEn: 'Shops & supermarkets', icon: 'store', isClientCategory: true },
  { key: 'producteurs-distributeurs', labelFr: 'Producteurs & Distributeurs', labelEn: 'Producers & distributors', icon: 'truck', isClientCategory: true },
  { key: 'catering', labelFr: 'Traiteur & Événementiel', labelEn: 'Catering & events', icon: 'calendar-heart', isClientCategory: true },
  { key: 'livreur', labelFr: 'Livreur indépendant', labelEn: 'Independent driver', icon: 'bike', isClientCategory: false },
  { key: 'societe-livraison', labelFr: 'Société de livraison', labelEn: 'Delivery company', icon: 'package', isClientCategory: false },
  { key: 'affilie', labelFr: 'Affilié marketing', labelEn: 'Marketing affiliate', icon: 'megaphone', isClientCategory: false },
];

export interface PlanSeed {
  readonly key: PlanKey;
  readonly name: string;
  readonly description: string;
  /** Serialised for `DECIMAL(14,2)`; never a JS float. */
  readonly price: string;
  readonly currency: string;
  readonly billingPeriod: 'MONTHLY' | 'YEARLY';
  readonly trialDays: number;
  readonly sortOrder: number;
}

export const PLANS: readonly PlanSeed[] = [
  {
    key: 'free',
    name: 'Gratuit',
    description: 'Pour découvrir la plateforme : caisse, catalogue et site vitrine.',
    price: '0.00',
    currency: 'EUR',
    billingPeriod: 'MONTHLY',
    trialDays: 0,
    sortOrder: 1,
  },
  {
    key: 'standard',
    name: 'Standard',
    description: 'Pour un commerce qui tourne : stock, fournisseurs, comptabilité, marketing.',
    price: '29.00',
    currency: 'EUR',
    billingPeriod: 'MONTHLY',
    // A trial only means something when there is a card to charge at the end of it, so
    // the free plan has none.
    trialDays: 14,
    sortOrder: 2,
  },
  {
    key: 'premium',
    name: 'Premium',
    description: 'Sans limite : paie, TVA, domaine personnalisé, fidélité et automatisations.',
    price: '79.00',
    currency: 'EUR',
    billingPeriod: 'MONTHLY',
    trialDays: 14,
    sortOrder: 3,
  },
];
