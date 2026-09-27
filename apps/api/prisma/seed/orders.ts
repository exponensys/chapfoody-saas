/**
 * Demo order types, front of house, and orders.
 *
 * The M2 seed calls for "a few orders per business" so no dashboard is ever empty. Two
 * constraints shape how this is written.
 *
 * ── The totals must reconcile, exactly ───────────────────────────────────────
 * The migration added CHECK constraints asserting
 * total = subtotal − discount + tax + fees + tip − rounding. So the arithmetic here is done in
 * integer CENTS, never floating point, and quantities are chosen to be binary-exact (1, 2, 0.5).
 * A demo that violated its own integrity constraints would fail at seed time — which is the
 * point: those constraints are load-bearing, not decorative.
 *
 * ── Re-running must not duplicate ────────────────────────────────────────────
 * Order numbers are deterministic ('DEMO-0001') and an order that already exists is skipped
 * entirely rather than rewritten. `order_status_history` is append-only in the database, so
 * delete-and-recreate would either duplicate the log or be refused by the policies.
 */

import type { TenantTransaction } from '../../src/infra/prisma/tenant-context.js';
import type { DemoCatalog } from './catalog-types.js';

/** Integer cents. Money never becomes a float on the way through this file. */
const cents = (value: string | number): number => Math.round(Number(value) * 100);
const money = (value: number): string => (value / 100).toFixed(2);

/** Percentage applied in integer cents, so the result matches the SQL CHECK exactly. */
const taxOn = (baseCents: number, ratePercent: string): number =>
  Math.round((baseCents * Number(ratePercent)) / 100);

interface OrderTypeSeed {
  readonly code: string;
  readonly name: string;
  readonly requiresTable: boolean;
  readonly requiresDeliveryAddress: boolean;
  readonly deliveryFee: string;
  readonly isDefault: boolean;
}

/** Categories that seat guests. The rest sell over a counter or at a distance. */
const TABLE_SERVICE = new Set(['restaurant', 'bars-maquis', 'metiers-de-bouche', 'catering']);

function orderTypesFor(category: string): OrderTypeSeed[] {
  const seatsGuests = TABLE_SERVICE.has(category);

  const types: OrderTypeSeed[] = [
    { code: 'takeaway', name: 'À emporter', requiresTable: false, requiresDeliveryAddress: false, deliveryFee: '0.00', isDefault: !seatsGuests },
    { code: 'delivery', name: 'Livraison', requiresTable: false, requiresDeliveryAddress: true, deliveryFee: '3.50', isDefault: false },
  ];

  if (seatsGuests) {
    types.unshift({ code: 'dine-in', name: 'Sur place', requiresTable: true, requiresDeliveryAddress: false, deliveryFee: '0.00', isDefault: true });
  }

  return types;
}

export async function seedOrderTypes(
  tx: TenantTransaction,
  businessId: string,
  category: string,
): Promise<{ count: number; idByCode: Map<string, string> }> {
  const idByCode = new Map<string, string>();
  const seeds = orderTypesFor(category);

  for (const [index, seed] of seeds.entries()) {
    const data = {
      name: seed.name,
      requiresTable: seed.requiresTable,
      requiresDeliveryAddress: seed.requiresDeliveryAddress,
      defaultDeliveryFee: seed.deliveryFee,
      isDefault: seed.isDefault,
      isActive: true,
      sortOrder: index,
    };

    const row = await tx.orderType.upsert({
      where: { businessId_code: { businessId, code: seed.code } },
      create: { businessId, code: seed.code, ...data },
      update: data,
    });

    idByCode.set(seed.code, row.id);
  }

  return { count: seeds.length, idByCode };
}

/** Tables and one booking — only for businesses that seat guests. */
export async function seedFrontOfHouse(
  tx: TenantTransaction,
  businessId: string,
  category: string,
  locationId: string,
): Promise<{ tables: number; reservations: number }> {
  if (!TABLE_SERVICE.has(category)) {
    return { tables: 0, reservations: 0 };
  }

  let tables = 0;

  for (const [index, name] of ['1', '2', '3', '4'].entries()) {
    const capacity = index < 2 ? 2 : 4;
    const zone = index === 3 ? 'Terrasse' : 'Salle';

    await tx.table.upsert({
      where: { businessId_name: { businessId, name } },
      create: { businessId, locationId, name, zone, capacity, sortOrder: index },
      update: { capacity, zone },
    });

    tables += 1;
  }

  // Anchored to the current day rather than a fixed date: a demo showing a booking from last
  // year teaches nobody anything.
  const reservedAt = new Date();
  reservedAt.setHours(reservedAt.getHours() + 3, 0, 0, 0);

  const existing = await tx.reservation.findFirst({
    where: { businessId, customerName: 'Famille Diop' },
    select: { id: true },
  });

  if (existing === null) {
    await tx.reservation.create({
      data: {
        businessId,
        customerName: 'Famille Diop',
        customerPhone: '+221 77 000 00 00',
        partySize: 4,
        reservedAt,
        status: 'CONFIRMED',
        note: 'Table près de la fenêtre (démonstration)',
      },
    });
  }

  return { tables, reservations: existing === null ? 1 : 0 };
}

/** Returns how many orders were created; re-runs create none. */
export async function seedOrders(
  tx: TenantTransaction,
  businessId: string,
  currency: string,
  catalog: DemoCatalog,
  orderTypeIdByCode: ReadonlyMap<string, string>,
  locationId: string,
  posSessionId: string,
): Promise<number> {
  const products = catalog.categories.flatMap((category) => category.products);
  const orderTypeId = orderTypeIdByCode.get('dine-in') ?? orderTypeIdByCode.get('takeaway');

  if (products.length < 2 || orderTypeId === undefined) {
    return 0;
  }

  // Two per business: one settled, one still in progress so the kitchen screen has a live
  // ticket. Deterministic numbers keep re-runs idempotent.
  const plans = [
    { number: 'DEMO-0001', settled: true, lines: products.slice(0, 2), tip: '1.00' },
    { number: 'DEMO-0002', settled: false, lines: products.slice(0, 1), tip: '0.00' },
  ];

  let created = 0;

  for (const plan of plans) {
    const already = await tx.order.findFirst({
      where: { businessId, number: plan.number },
      select: { id: true },
    });

    if (already !== null) {
      continue;
    }

    const order = await tx.order.create({
      data: {
        businessId,
        locationId,
        orderTypeId,
        number: plan.number,
        channel: 'POS',
        status: 'OPEN',
        placedAt: new Date(),
        currency,
        posSessionId,
        // Filled in below once the lines are priced. Zero is a valid intermediate state, and
        // the whole write happens in one transaction, so nobody observes it.
        subtotal: '0.00',
        total: '0.00',
      },
    });

    let subtotalCents = 0;
    let taxCents = 0;

    for (const [index, product] of plan.lines.entries()) {
      const quantity = index === 0 ? 2 : 1;
      const unitPriceCents = cents(product.price);
      const baseCents = quantity * unitPriceCents;
      const lineTaxCents = taxOn(baseCents, product.vatRate ?? '0');

      subtotalCents += baseCents;
      taxCents += lineTaxCents;

      await tx.orderLine.create({
        data: {
          businessId,
          orderId: order.id,
          name: product.name,
          sku: product.sku,
          quantity: quantity.toFixed(3),
          unitPrice: money(unitPriceCents),
          unitCost: product.costPrice ?? null,
          taxRate: product.vatRate ?? '0',
          taxAmount: money(lineTaxCents),
          lineTotal: money(baseCents + lineTaxCents),
          status: plan.settled ? 'SERVED' : 'PENDING',
          sortOrder: index,
        },
      });
    }

    const tipCents = cents(plan.tip);
    const totalCents = subtotalCents + taxCents + tipCents;

    await tx.order.update({
      where: { id: order.id },
      data: {
        subtotal: money(subtotalCents),
        taxAmount: money(taxCents),
        tipAmount: money(tipCents),
        total: money(totalCents),
        paidAmount: plan.settled ? money(totalCents) : '0.00',
        status: plan.settled ? 'COMPLETED' : 'OPEN',
        completedAt: plan.settled ? new Date() : null,
      },
    });

    // A transition per step, so the history screen shows a real progression rather than one
    // entry that arrived from nowhere. `as const` keeps the literals narrow, so they satisfy
    // the generated OrderStatus type without an annotation to keep in step by hand.
    const settledPath = ['OPEN', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'] as const;
    const openPath = ['OPEN'] as const;
    const path = plan.settled ? settledPath : openPath;

    await tx.orderStatusHistory.createMany({
      data: path.map((toStatus, index) => ({
        businessId,
        orderId: order.id,
        fromStatus: index === 0 ? null : path[index - 1],
        toStatus,
        reason: 'Démonstration',
      })),
    });

    created += 1;
  }

  return created;
}
