/**
 * Demo VAT rates, a till session, and the tenders that settle the demo orders.
 *
 * ── VAT rates are derived from the catalogue, not hard-coded ─────────────────
 * The rates a business declares are the ones its products actually use. Reading them out of the
 * catalogue data means the two cannot disagree: if the demo restaurant later stops using 5.5 %,
 * the rate list follows without anyone remembering to update it.
 *
 * ── The till session is left OPEN ────────────────────────────────────────────
 * An open session is what a working day looks like, and an open session has no Z-report by
 * definition — closing one exists to freeze the figures. `CashClosure` and `VatDeclaration` are
 * therefore schema-only for now, like `StockCount` and `PurchaseOrder`: the tables and their
 * constraints are in place and tested, but no demo row pretends a day has ended.
 *
 * Every figure here satisfies the CHECK constraints added by the migration: the tender's change
 * does not exceed the amount tendered, the cash movement is non-zero, and the session's float is
 * not negative.
 */

import type { TenantTransaction } from '../../src/infra/prisma/tenant-context.js';
import type { DemoCatalog } from './catalog-types.js';

export interface TillCounters {
  vatRates: number;
  posSessions: number;
  tenders: number;
  cashMovements: number;
}

const cents = (value: string | number): number => Math.round(Number(value) * 100);
const money = (value: number): string => (value / 100).toFixed(2);

/** The float a drawer starts with. */
const OPENING_FLOAT = '100.00';

export async function seedVatRates(
  tx: TenantTransaction,
  businessId: string,
  catalog: DemoCatalog,
): Promise<number> {
  const used = new Map<string, number>();

  for (const product of catalog.categories.flatMap((category) => category.products)) {
    const rate = product.vatRate ?? '0';
    used.set(rate, (used.get(rate) ?? 0) + 1);
  }

  // The most-used rate becomes the default, so a new product pre-fills with the common case.
  const mostUsed = [...used.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '0';
  let created = 0;

  for (const [index, rate] of [...used.keys()].sort((a, b) => Number(a) - Number(b)).entries()) {
    const data = {
      name: Number(rate) === 0 ? 'Exonéré de TVA' : `TVA ${Number(rate)} %`,
      isDefault: rate === mostUsed,
      isActive: true,
      sortOrder: index,
    };

    await tx.vatRate.upsert({
      where: { businessId_rate: { businessId, rate } },
      create: { businessId, rate, ...data },
      update: data,
    });

    created += 1;
  }

  return created;
}

export async function seedPosSession(
  tx: TenantTransaction,
  businessId: string,
  locationId: string,
  openedById: string,
  currency: string,
): Promise<{ id: string; created: boolean }> {
  // `findFirst` rather than upsert: "one open session per location" rests on a PARTIAL index,
  // which Prisma cannot name as an upsert key — so the check is explicit.
  const existing = await tx.posSession.findFirst({
    where: { businessId, locationId, status: 'OPEN' },
    select: { id: true },
  });

  if (existing !== null) {
    return { id: existing.id, created: false };
  }

  const session = await tx.posSession.create({
    data: {
      businessId,
      locationId,
      openedById,
      openedAt: new Date(),
      openingFloat: OPENING_FLOAT,
      currency,
      status: 'OPEN',
      note: 'Session de démonstration',
    },
  });

  // The float is a MOVEMENT, not just a column: the drawer's history has to explain every euro
  // in it, and a starting balance with no entry behind it explains nothing.
  await tx.cashMovement.create({
    data: {
      businessId,
      posSessionId: session.id,
      reason: 'OPENING_FLOAT',
      amount: OPENING_FLOAT,
      actorUserId: openedById,
      note: 'Fond de caisse (démonstration)',
    },
  });

  return { id: session.id, created: true };
}

/** Settles the completed demo order in cash and records the matching drawer movement. */
export async function seedTenders(
  tx: TenantTransaction,
  businessId: string,
  posSessionId: string,
  openedById: string,
): Promise<{ tenders: number; movements: number }> {
  const order = await tx.order.findFirst({
    where: { businessId, number: 'DEMO-0001' },
    select: { id: true, total: true, currency: true },
  });

  if (order === null) {
    return { tenders: 0, movements: 0 };
  }

  const already = await tx.paymentTransaction.findFirst({
    where: { businessId, orderId: order.id, posSessionId },
    select: { id: true },
  });

  if (already !== null) {
    return { tenders: 0, movements: 0 };
  }

  const total = money(cents(order.total.toString()));

  await tx.paymentTransaction.create({
    data: {
      businessId,
      orderId: order.id,
      posSessionId,
      method: 'CASH',
      status: 'CAPTURED',
      amount: total,
      currency: order.currency,
      // Exact change: the demo does not invent a rounding difference it would then have to
      // explain in the Z-report.
      changeGiven: '0.00',
      capturedAt: new Date(),
      actorUserId: openedById,
    },
  });

  await tx.cashMovement.create({
    data: {
      businessId,
      posSessionId,
      reason: 'CASH_SALE',
      amount: total,
      actorUserId: openedById,
      note: 'Encaissement DEMO-0001',
    },
  });

  return { tenders: 1, movements: 1 };
}
