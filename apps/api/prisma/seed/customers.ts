/**
 * Demo customers: two per business, with addresses, a note and a consent history.
 *
 * ── Why exactly two, and why these two ───────────────────────────────────────
 * Customer 1 BOUGHT something: she is the one the demo orders attach to, she came from the affiliate
 * programme, and she has a full consent history including a WITHDRAWAL. Customer 2 has never bought
 * anything — which is the point of the LEAD status, and the only way the "captured but unconverted"
 * screen has a row in it.
 *
 * ── The withdrawal is the important row ──────────────────────────────────────
 * `customer_consent` is append-only in the database: no UPDATE, no DELETE. So the demo does not
 * overwrite an opt-in to represent an opt-out. It writes a WITHDRAWN event beside the original
 * GRANTED one, and both survive — which is what makes "she agreed on the 3rd, then refused by phone
 * on the 20th" recoverable at all. A boolean on the customer could not record that, and would have
 * lost the proof on the first change of mind.
 *
 * ── Idempotency is per-collection, not per-row ───────────────────────────────
 * Every child row is guarded by a lookup on its natural key. Addresses and notes can be updated, but
 * the seed does not update them: re-running must leave a database someone has since edited alone.
 */

import type { TenantTransaction } from '../../src/infra/prisma/tenant-context.js';

export interface CustomerSeedResult {
  count: number;
  /** The customer the demo orders belong to, or null if the seed was interrupted. */
  primaryId: string | null;
}

interface ConsentPlan {
  channel: 'EMAIL' | 'SMS' | 'PHONE';
  purpose: 'MARKETING' | 'TRANSACTIONAL';
  status: 'GRANTED' | 'WITHDRAWN';
  source: 'WEB' | 'POS' | 'VERBAL';
  policyVersion?: string;
  legalText?: string;
  contextRef?: string;
  /** Days before now, so the ledger reads as a sequence rather than three rows at one instant. */
  daysAgo: number;
}

interface CustomerPlan {
  number: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'LEAD' | 'ACTIVE';
  source: 'REFERRAL' | 'STOREFRONT';
  tags: string[];
  birthDate: string;
  /** The default saved address, which is what the order's free-text snapshot is filled from. */
  address: {
    label: string;
    addressLine1: string;
    city: string;
    postalCode: string;
    latitude: string;
    longitude: string;
    deliveryInstructions: string;
  };
  note?: { body: string; isPinned: boolean };
  consents: ConsentPlan[];
}

const PLANS: readonly CustomerPlan[] = [
  {
    // She bought, she came from the affiliate programme, and she changed her mind about SMS.
    number: 'CLI-000001',
    firstName: 'Fatou',
    lastName: 'Ndiaye',
    email: 'fatou.ndiaye@client.test',
    phone: '+221 77 111 22 33',
    status: 'ACTIVE',
    source: 'REFERRAL',
    tags: ['VIP', 'habituée'],
    birthDate: '1990-04-17',
    address: {
      label: 'Domicile',
      addressLine1: '12 rue des Almadies',
      city: 'Dakar',
      postalCode: '10000',
      latitude: '14.739700',
      longitude: '-17.490200',
      deliveryInstructions: 'Portail bleu, 3e étage, sonner deux fois.',
    },
    note: {
      body: 'Préfère être appelée le matin. Allergie aux arachides.',
      isPinned: true,
    },
    consents: [
      {
        channel: 'EMAIL',
        purpose: 'MARKETING',
        status: 'GRANTED',
        source: 'WEB',
        policyVersion: 'v1',
        legalText: "J'accepte de recevoir les offres commerciales par e-mail.",
        daysAgo: 40,
      },
      {
        channel: 'EMAIL',
        purpose: 'TRANSACTIONAL',
        status: 'GRANTED',
        source: 'WEB',
        policyVersion: 'v1',
        legalText: "J'accepte de recevoir les confirmations de commande.",
        daysAgo: 40,
      },
      {
        // The withdrawal: a NEW row beside the GRANTED one, never an edit of it. Same channel and
        // same purpose on purpose — that is the case the ledger exists for. An opt-in followed by an
        // opt-out on a different channel would only prove that two unrelated rows can coexist; this
        // proves the history of ONE decision survives, which is what a dispute asks about.
        channel: 'EMAIL',
        purpose: 'MARKETING',
        status: 'WITHDRAWN',
        source: 'VERBAL',
        contextRef: 'Appel du 20 — demande de retrait',
        daysAgo: 12,
      },
    ],
  },
  {
    // Captured on the storefront and never bought: this is what a LEAD looks like.
    number: 'CLI-000002',
    firstName: 'Moussa',
    lastName: 'Traoré',
    email: 'moussa.traore@client.test',
    phone: '+221 78 444 55 66',
    status: 'LEAD',
    source: 'STOREFRONT',
    tags: ['newsletter'],
    birthDate: '1985-11-02',
    address: {
      label: 'Bureau',
      addressLine1: '45 avenue Pompidou',
      city: 'Dakar',
      postalCode: '11000',
      latitude: '14.716700',
      longitude: '-17.467700',
      deliveryInstructions: 'Réception au 2e étage, demander Moussa.',
    },
    // A denial, so the "refused" path has a row as well as the granted one.
    consents: [
      {
        channel: 'EMAIL',
        purpose: 'MARKETING',
        status: 'GRANTED',
        source: 'WEB',
        policyVersion: 'v1',
        legalText: "J'accepte de recevoir la newsletter.",
        daysAgo: 6,
      },
      {
        channel: 'SMS',
        purpose: 'MARKETING',
        status: 'WITHDRAWN',
        source: 'WEB',
        policyVersion: 'v1',
        legalText: "J'accepte de recevoir les offres par SMS.",
        daysAgo: 6,
      },
    ],
  },
];

const daysAgo = (days: number): Date => new Date(Date.now() - days * 24 * 60 * 60_000);

/** Integer cents. Money never becomes a float on the way through this file. */
const cents = (value: string | number): number => Math.round(Number(value) * 100);
const money = (value: number): string => (value / 100).toFixed(2);

/** Creates the demo customers. Returns the one the demo orders should attach to. */
export async function seedCustomers(
  tx: TenantTransaction,
  businessId: string,
  country: string,
  userId: string,
): Promise<CustomerSeedResult> {
  let count = 0;
  let primaryId: string | null = null;

  for (const plan of PLANS) {
    const existing = await tx.customer.findFirst({
      where: { businessId, number: plan.number },
      select: { id: true },
    });

    const customer =
      existing ??
      (await tx.customer.create({
        data: {
          businessId,
          number: plan.number,
          firstName: plan.firstName,
          lastName: plan.lastName,
          email: plan.email,
          phone: plan.phone,
          birthDate: new Date(plan.birthDate),
          locale: 'fr',
          tags: plan.tags,
          status: plan.status,
          source: plan.source,
          createdById: userId,
        },
        select: { id: true },
      }));

    if (existing === null) {
      count += 1;
    }

    if (plan.number === 'CLI-000001') {
      primaryId = customer.id;
    }

    // The address: guarded on the DEFAULT flag, because a partial unique index allows a customer at
    // most one default — a second insert here would be refused, which is the intended behaviour.
    const address = await tx.customerAddress.findFirst({
      where: { customerId: customer.id, isDefault: true },
      select: { id: true },
    });

    if (address === null) {
      await tx.customerAddress.create({
        data: {
          businessId,
          customerId: customer.id,
          label: plan.address.label,
          addressLine1: plan.address.addressLine1,
          city: plan.address.city,
          postalCode: plan.address.postalCode,
          country,
          latitude: plan.address.latitude,
          longitude: plan.address.longitude,
          deliveryInstructions: plan.address.deliveryInstructions,
          isDefault: true,
        },
      });
    }

    if (plan.note !== undefined) {
      const note = await tx.customerNote.findFirst({
        where: { customerId: customer.id, body: plan.note.body },
        select: { id: true },
      });

      if (note === null) {
        await tx.customerNote.create({
          data: {
            businessId,
            customerId: customer.id,
            authorId: userId,
            body: plan.note.body,
            isPinned: plan.note.isPinned,
          },
        });
      }
    }

    // Consent is append-only, so "has this been seeded?" is a lookup on the EVENT — matching the
    // channel, the purpose AND the outcome. Checking only the channel would mistake a withdrawal for
    // the grant it replaced and skip writing it.
    for (const consent of plan.consents) {
      const seen = await tx.customerConsent.findFirst({
        where: {
          customerId: customer.id,
          channel: consent.channel,
          purpose: consent.purpose,
          status: consent.status,
        },
        select: { id: true },
      });

      if (seen !== null) {
        continue;
      }

      await tx.customerConsent.create({
        data: {
          businessId,
          customerId: customer.id,
          channel: consent.channel,
          purpose: consent.purpose,
          status: consent.status,
          source: consent.source,
          // Required by a CHECK for a GRANTED row: consent to WHAT? A grant that records neither the
          // wording nor its version proves nothing.
          policyVersion: consent.policyVersion ?? null,
          legalText: consent.legalText ?? null,
          contextRef: consent.contextRef ?? null,
          ipAddress: consent.source === 'WEB' ? '41.82.0.14' : null,
          userAgent: consent.source === 'WEB' ? 'Mozilla/5.0 (démonstration)' : null,
          recordedAt: daysAgo(consent.daysAgo),
        },
      });
    }
  }

  return { count, primaryId };
}

/**
 * Recompute every customer's counters from their orders.
 *
 * ── Why this exists, and why it is not an upsert ─────────────────────────────
 * `totalOrders`, `totalSpent`, `firstOrderAt` and `lastOrderAt` on the customer are DENORMALISED,
 * for the reason all denormalisation exists: a customer list must not aggregate the whole order
 * table to draw one screen. Denormalised data drifts, and the usual answer is "a trigger keeps it in
 * step" — but a trigger cannot run in a seed, and this is the code that creates the orders.
 *
 * So the seed reconciles AFTER the orders exist. That is not a workaround: it is the same
 * computation a nightly job would run, and doing it here means the demo data satisfies the invariant
 * rather than merely appearing to — which is what lets a test assert it. A trigger would have made
 * that assertion impossible from the application side.
 *
 * Only COMPLETED orders count. A cancelled order is not a visit, and counting it would inflate
 * "total spent" in exactly the way that makes a customer report untrustworthy.
 */
export async function reconcileCustomerTotals(
  tx: TenantTransaction,
  businessId: string,
): Promise<number> {
  const customers = await tx.customer.findMany({
    where: { businessId },
    select: { id: true },
  });

  for (const customer of customers) {
    const orders = await tx.order.findMany({
      where: { businessId, customerId: customer.id, status: 'COMPLETED' },
      select: { total: true, placedAt: true },
      orderBy: { placedAt: 'asc' },
    });

    const spent = orders.reduce((sum, order) => sum + cents(order.total.toString()), 0);

    await tx.customer.update({
      where: { id: customer.id },
      data: {
        totalOrders: orders.length,
        totalSpent: money(spent),
        // Both null together, or the CHECK that says "no orders means no last order" refuses it.
        firstOrderAt: orders.at(0)?.placedAt ?? null,
        lastOrderAt: orders.at(-1)?.placedAt ?? null,
      },
    });
  }

  return customers.length;
}

