/**
 * Demo vendors: a commission rule, a vendor, and the commission earned on the settled sale.
 *
 * ── The commission is computed the way the rule says, in integer cents ───────
 * `round(base × rate / 100)` on integer cents, so the stored amount is exact. The rule is stored on
 * the assignment alongside the amount it produced — a rate renegotiated next month must not change
 * what someone was owed for a sale made this month.
 *
 * ── The base excludes tax and tip ────────────────────────────────────────────
 * A vendor's commission is earned on what the business sold, not on the VAT it collected on the
 * state's behalf or on a tip held for the kitchen. Using the order's total would overpay by both.
 */

import type { TenantTransaction } from '../../src/infra/prisma/tenant-context.js';

export interface VendorCounters {
  commissionRules: number;
  vendors: number;
  assignments: number;
  targets: number;
}

const cents = (value: string | number): number => Math.round(Number(value) * 100);
const money = (value: number): string => (value / 100).toFixed(2);

/** The business-wide rate the demo uses. */
const COMMISSION_RATE = '5.00';

export async function seedVendors(
  tx: TenantTransaction,
  businessId: string,
  currency: string,
  userId: string,
): Promise<VendorCounters> {
  const counters: VendorCounters = { commissionRules: 0, vendors: 0, assignments: 0, targets: 0 };

  // 1. A business-wide rule: 5 % of the order, for every vendor.
  const existingRule = await tx.vendorCommissionRule.findFirst({
    where: { businessId, name: 'Commission standard 5 %' },
    select: { id: true },
  });

  const rule =
    existingRule ??
    (await tx.vendorCommissionRule.create({
      data: {
        businessId,
        vendorId: null,
        name: 'Commission standard 5 %',
        scope: 'ORDER',
        rate: COMMISSION_RATE,
        priority: 0,
        isActive: true,
      },
    }));

  if (existingRule === null) {
    counters.commissionRules += 1;
  }

  // 2. The vendor. Linked to the account that took the demo orders, because that is who sold them.
  const existingVendor = await tx.vendor.findFirst({
    where: { businessId, code: 'V-01' },
    select: { id: true },
  });

  const vendor =
    existingVendor ??
    (await tx.vendor.create({
      data: {
        businessId,
        userId,
        code: 'V-01',
        firstName: 'Vendeur',
        lastName: 'Démo',
        email: 'vendeur@demo.test',
        commissionRate: COMMISSION_RATE,
        isInternal: true,
        isActive: true,
        startedAt: new Date(),
        createdById: userId,
      },
    }));

  if (existingVendor === null) {
    counters.vendors += 1;
  }

  // 3. The commission on the settled sale. Base is the SUBTOTAL: no tax, no tip.
  const order = await tx.order.findFirst({
    where: { businessId, number: 'DEMO-0001' },
    select: {
      id: true,
      subtotal: true,
      placedAt: true,
      vendorAssignment: { select: { id: true } },
    },
  });

  if (order !== null && order.vendorAssignment === null) {
    const base = order.subtotal.toString();
    const amount = money(Math.round((cents(base) * Number(COMMISSION_RATE)) / 100));

    await tx.vendorAssignment.create({
      data: {
        businessId,
        vendorId: vendor.id,
        orderId: order.id,
        commissionBase: base,
        commissionRate: COMMISSION_RATE,
        commissionAmount: amount,
        commissionRuleId: rule.id,
      },
    });

    counters.assignments += 1;
  }

  // 4. A monthly target, with what has been achieved so far written into it. Stored rather than
  //    summed live: a target is assessed at a moment.
  const periodStart = new Date();
  periodStart.setDate(1);
  periodStart.setHours(0, 0, 0, 0);

  const periodEnd = new Date(periodStart);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const achieved = order === null ? '0.00' : order.subtotal.toString();

  await tx.vendorTarget.upsert({
    where: {
      vendorId_periodStart_periodEnd: { vendorId: vendor.id, periodStart, periodEnd },
    },
    create: {
      businessId,
      vendorId: vendor.id,
      periodStart,
      periodEnd,
      targetAmount: '500.00',
      achievedAmount: achieved,
      bonusRate: '2.00',
      currency,
      note: 'Objectif mensuel (démonstration)',
    },
    update: {},
  });

  counters.targets += 1;

  return counters;
}
