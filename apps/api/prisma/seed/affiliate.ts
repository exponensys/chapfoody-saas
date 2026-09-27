/**
 * Demo affiliate programme: a partner, a link, a referral, a commission and its payout.
 *
 * ── The whole lifecycle, because the interesting constraints are at the end of it ──────
 * The migration added a rule that a PAID commission must point at a payout and carry a date. Seeding
 * only a PENDING commission would leave that rule unexercised, so this walks the full path: referral
 * attributed → confirmed → commission approved → paid inside a payout. The last step is the one that
 * would fail if the constraint were wrong.
 *
 * ── Attribution is stored, not recomputed ────────────────────────────────────
 * The commission copies the rate it was computed with. Renegotiating the partnership next month must
 * not change what was earned this month — the same reasoning as an order line copying its price.
 */

import type { TenantTransaction } from '../../src/infra/prisma/tenant-context.js';

export interface AffiliateCounters {
  affiliates: number;
  referralLinks: number;
  referrals: number;
  commissions: number;
  payouts: number;
}

const cents = (value: string | number): number => Math.round(Number(value) * 100);
const money = (value: number): string => (value / 100).toFixed(2);

/** The partnership rate the demo uses. */
const COMMISSION_RATE = '8.00';

export async function seedAffiliate(
  tx: TenantTransaction,
  businessId: string,
  currency: string,
  userId: string,
): Promise<AffiliateCounters> {
  const counters: AffiliateCounters = {
    affiliates: 0,
    referralLinks: 0,
    referrals: 0,
    commissions: 0,
    payouts: 0,
  };

  // ── 1. The partner ─────────────────────────────────────────────────────────
  const existingAffiliate = await tx.affiliate.findFirst({
    where: { businessId, code: 'NADIA01' },
    select: { id: true },
  });

  const affiliate =
    existingAffiliate ??
    (await tx.affiliate.create({
      data: {
        businessId,
        code: 'NADIA01',
        displayName: 'Nadia Haddad',
        email: 'nadia@affilie.test',
        phone: '+221 77 333 33 33',
        website: 'https://nadia-demo.test',
        socials: { instagram: '@nadia.demo', tiktok: '@nadiademo' },
        commissionRate: COMMISSION_RATE,
        attributionWindowDays: 30,
        status: 'ACTIVE',
        payoutMethod: 'MOBILE_MONEY',
        payoutDetails: { network: 'wave', number: '+221 77 333 33 33' },
        approvedAt: new Date(),
        notes: 'Partenaire de démonstration',
      },
    }));

  if (existingAffiliate === null) {
    counters.affiliates += 1;
  }

  // ── 2. A link ──────────────────────────────────────────────────────────────
  const existingLink = await tx.referralLink.findFirst({
    where: { businessId, code: 'NADIA-WEB' },
    select: { id: true },
  });

  const link =
    existingLink ??
    (await tx.referralLink.create({
      data: {
        businessId,
        affiliateId: affiliate.id,
        code: 'NADIA-WEB',
        label: 'Lien vitrine',
        targetType: 'STOREFRONT',
        // Counted, not stored as rows: the click's value is in the aggregate.
        clicks: 128,
        firstClickAt: new Date(Date.now() - 20 * 24 * 60 * 60_000),
        lastClickAt: new Date(Date.now() - 2 * 60 * 60_000),
      },
    }));

  if (existingLink === null) {
    counters.referralLinks += 1;
  }

  return finishAffiliate(tx, businessId, currency, userId, {
    counters,
    affiliateId: affiliate.id,
    linkId: link.id,
  });
}

interface AffiliateContext {
  counters: AffiliateCounters;
  affiliateId: string;
  linkId: string;
}

/** The referral, its commission, and the payout that settles it. */
async function finishAffiliate(
  tx: TenantTransaction,
  businessId: string,
  currency: string,
  userId: string,
  context: AffiliateContext,
): Promise<AffiliateCounters> {
  const { counters, affiliateId, linkId } = context;

  const order = await tx.order.findFirst({
    where: { businessId, number: 'DEMO-0001' },
    select: { id: true, number: true, subtotal: true, placedAt: true },
  });

  if (order === null) {
    return counters;
  }

  // One attribution per order — the unique key on order_id is what guarantees it.
  const existingReferral = await tx.referral.findFirst({
    where: { businessId, orderId: order.id },
    select: { id: true },
  });

  const referral =
    existingReferral ??
    (await tx.referral.create({
      data: {
        businessId,
        affiliateId,
        referralLinkId: linkId,
        kind: 'ORDER',
        orderId: order.id,
        customerRef: `Client ${order.number}`,
        status: 'CONFIRMED',
        occurredAt: order.placedAt,
        // The base excludes tax and delivery — a partner earns on what was sold, not on what the
        // business collected on the state's behalf or paid a courier.
        baseAmount: order.subtotal.toString(),
        currency,
        confirmedAt: new Date(),
        // Recorded for the fraud review every programme ends up needing: self-referral and click
        // farms are both visible here.
        ipAddress: '41.82.0.14',
        userAgent: 'Mozilla/5.0 (démonstration)',
      },
    }));

  if (existingReferral === null) {
    counters.referrals += 1;
  }

  // ── The commission ─────────────────────────────────────────────────────────
  const existingCommission = await tx.commission.findFirst({
    where: { businessId, referralId: referral.id },
    select: { id: true },
  });

  if (existingCommission !== null) {
    return counters;
  }

  // The payout period is the month the sale happened in, which is the rule a programme wants: a
  // partner is paid for the month they earned in.
  const periodStart = new Date(order.placedAt);
  periodStart.setDate(1);
  periodStart.setHours(0, 0, 0, 0);

  const periodEnd = new Date(periodStart);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const base = cents(order.subtotal.toString());
  const amount = money(Math.round((base * Number(COMMISSION_RATE)) / 100));

  const payout = await tx.payout.create({
    data: {
      businessId,
      affiliateId,
      periodStart,
      periodEnd,
      status: 'PAID',
      totalAmount: amount,
      currency,
      method: 'MOBILE_MONEY',
      reference: 'WAVE-DEMO-0001',
      approvedById: userId,
      approvedAt: new Date(),
      // PAID without a date is refused by a CHECK, which is the point of setting it here.
      paidAt: new Date(),
      createdById: userId,
      note: 'Versement de démonstration',
    },
  });

  counters.payouts += 1;

  await tx.commission.create({
    data: {
      businessId,
      affiliateId,
      referralId: referral.id,
      type: 'REFERRAL',
      amount,
      currency,
      // Copied, so renegotiating the rate later does not rewrite what was earned.
      rate: COMMISSION_RATE,
      status: 'PAID',
      approvedById: userId,
      approvedAt: new Date(),
      // A PAID commission must point at its payout and carry a date — both asserted by a CHECK.
      payoutId: payout.id,
      paidAt: new Date(),
      note: `Commission ${order.number}`,
    },
  });

  counters.commissions += 1;

  return counters;
}
