/**
 * The eight accounts of section 5.4 of the implementation plan.
 *
 * These are the documented demo logins: their passwords come from the requirements
 * document, are deliberately weak, and exist only here — `prisma/` is excluded from
 * production images and the seed refuses to run against production.
 *
 * Section 5.4 lists `delivery@email.com` twice with the same password. That duplicate is
 * treated as a typo in the requirement and seeded once, as the independent driver.
 *
 * A `null` business means a platform account with no tenant of its own: the super-admin
 * administers the platform rather than trading on it.
 */

import type { PlanKey } from './features.js';

export interface AccountBusinessSeed {
  /** BusinessType key — one of the ten dashboards. */
  readonly category: string;
  readonly name: string;
  readonly slug: string;
  /** A PlanKey, not a bare string: the entitlement resolution indexes by plan, and a
   *  typo here would otherwise only surface as a silently missing entitlement. */
  readonly planKey: PlanKey;
  readonly currency: string;
  readonly country: string;
  readonly city: string;
  readonly timezone: string;
}

export interface AccountSeed {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: 'SUPER_ADMIN' | 'OWNER';
  readonly business: AccountBusinessSeed | null;
}

export const SEED_PASSWORD_HINT = 'must be changed at first sign-in';

export const ACCOUNTS: readonly AccountSeed[] = [
  {
    email: 'super_admin@email.com',
    password: 'Admin123#@!$',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'SUPER_ADMIN',
    business: null,
  },
  {
    email: 'restaurant@email.com',
    password: 'Resto123#@!$',
    firstName: 'Awa',
    lastName: 'Traoré',
    role: 'OWNER',
    business: {
      category: 'restaurant',
      name: 'Chez Awa (démo)',
      slug: 'demo-restaurant',
      planKey: 'premium',
      // EUR/Paris…
      currency: 'EUR',
      country: 'FR',
      city: 'Paris',
      timezone: 'Europe/Paris',
    },
  },
  {
    email: 'catering@email.com',
    password: 'Catering123#@!$',
    firstName: 'Jean',
    lastName: 'Marchand',
    role: 'OWNER',
    business: {
      category: 'catering',
      name: 'Traiteur Marchand (démo)',
      slug: 'demo-catering',
      planKey: 'standard',
      currency: 'EUR',
      country: 'BE',
      city: 'Bruxelles',
      timezone: 'Europe/Brussels',
    },
  },
  {
    email: 'shop@email.com',
    password: 'Shop123#@!$',
    firstName: 'Sofia',
    lastName: 'Bennani',
    role: 'OWNER',
    business: {
      category: 'boutiques-supermarche',
      name: 'Supérette Bennani (démo)',
      slug: 'demo-boutique',
      planKey: 'standard',
      currency: 'EUR',
      country: 'FR',
      city: 'Marseille',
      timezone: 'Europe/Paris',
    },
  },
  {
    email: 'grocery@email.com',
    password: 'Shop123#@!$',
    firstName: 'Fatou',
    lastName: 'Diallo',
    role: 'OWNER',
    business: {
      category: 'epiceries-fruiteries',
      name: 'Épicerie Diallo (démo)',
      slug: 'demo-epicerie',
      planKey: 'free',
      // XOF has no minor unit; the schema stores money as DECIMAL(14,2) regardless, so
      // amounts always carry ".00" for these tenants.
      currency: 'XOF',
      country: 'SN',
      city: 'Dakar',
      timezone: 'Africa/Dakar',
    },
  },
  {
    email: 'delivery@email.com',
    password: 'Delivery123#@!$',
    firstName: 'Moussa',
    lastName: 'Keïta',
    role: 'OWNER',
    business: {
      category: 'livreur',
      name: 'Moussa Keïta (démo)',
      slug: 'demo-livreur',
      planKey: 'free',
      currency: 'XOF',
      country: 'SN',
      city: 'Dakar',
      timezone: 'Africa/Dakar',
    },
  },
  {
    email: 'company@email.com',
    password: 'Company123#@!$',
    firstName: 'Ibrahim',
    lastName: 'Coulibaly',
    role: 'OWNER',
    business: {
      category: 'societe-livraison',
      name: 'Coulibaly Express (démo)',
      slug: 'demo-societe-livraison',
      planKey: 'standard',
      currency: 'XOF',
      country: 'CI',
      city: 'Abidjan',
      timezone: 'Africa/Abidjan',
    },
  },
  {
    email: 'affiliate@email.com',
    password: 'Affiliate123#@!$',
    firstName: 'Nadia',
    lastName: 'Haddad',
    role: 'OWNER',
    business: {
      category: 'affilie',
      name: 'Nadia Haddad (démo)',
      slug: 'demo-affilie',
      planKey: 'free',
      currency: 'EUR',
      country: 'FR',
      city: 'Lyon',
      timezone: 'Europe/Paris',
    },
  },
];
