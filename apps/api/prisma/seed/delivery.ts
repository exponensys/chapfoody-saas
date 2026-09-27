/**
 * Demo delivery: a zone, two distance bands, a driver, and a delivered order.
 *
 * ── Why this creates its own order ───────────────────────────────────────────
 * The orders seeded elsewhere are dine-in or takeaway, which is what the demo businesses for those
 * categories actually sell. A delivery needs a DELIVERY-type order, so this creates one (DEMO-0003)
 * rather than stretching an order that was never going to be driven anywhere.
 *
 * Scope limit, stated rather than implied: DEMO-0003 is operational demo data and is NOT posted to the
 * ledger — the accounting seed posts DEMO-0001 only. A delivery order in production would be posted
 * like any other sale; the link exists (`AccountingExport` read it) but the demo does not duplicate it.
 */

import type { TenantTransaction } from '../../src/infra/prisma/tenant-context.js';

export interface DeliveryCounters {
  zones: number;
  radiusRules: number;
  drivers: number;
  deliveries: number;
  deliveryEvents: number;
  driverEarnings: number;
}

const cents = (value: string | number): number => Math.round(Number(value) * 100);
const money = (value: number): string => (value / 100).toFixed(2);

export async function seedDelivery(
  tx: TenantTransaction,
  businessId: string,
  currency: string,
  userId: string,
  locationId: string,
  orderTypeIdByCode: ReadonlyMap<string, string>,
): Promise<DeliveryCounters> {
  const counters: DeliveryCounters = {
    zones: 0,
    radiusRules: 0,
    drivers: 0,
    deliveries: 0,
    deliveryEvents: 0,
    driverEarnings: 0,
  };

  // ── 1. A named zone, and two distance bands ────────────────────────────────
  // Both models are seeded on purpose: they are alternatives, and seeing both makes it obvious that
  // a business picks one rather than needing both.
  const existingZone = await tx.deliveryZone.findFirst({
    where: { businessId, name: 'Centre-ville' },
    select: { id: true },
  });

  const zone =
    existingZone ??
    (await tx.deliveryZone.create({
      data: {
        businessId,
        name: 'Centre-ville',
        code: 'CV',
        description: 'Livraison en centre-ville (démonstration)',
        color: '#b70f23',
        deliveryFee: '3.50',
        minOrderAmount: '10.00',
        freeDeliveryThreshold: '50.00',
        estimatedMinutes: 30,
        isActive: true,
        sortOrder: 0,
      },
    }));

  if (existingZone === null) {
    counters.zones += 1;
  }

  const bands = [
    { name: '0 – 3 km', min: '0.00', max: '3.00', fee: '2.50', minutes: 20 },
    { name: '3 – 8 km', min: '3.00', max: '8.00', fee: '5.00', minutes: 45 },
  ];

  for (const [index, band] of bands.entries()) {
    const existing = await tx.deliveryRadiusRule.findFirst({
      where: { businessId, name: band.name },
      select: { id: true },
    });

    if (existing === null) {
      await tx.deliveryRadiusRule.create({
        data: {
          businessId,
          name: band.name,
          minDistanceKm: band.min,
          maxDistanceKm: band.max,
          deliveryFee: band.fee,
          estimatedMinutes: band.minutes,
          sortOrder: index,
        },
      });

      counters.radiusRules += 1;
    }
  }

  // ── 2. A driver, and a delivery company that rosters one ───────────────────
  const existingDriver = await tx.driver.findFirst({
    where: { businessId, code: 'L-01' },
    select: { id: true },
  });

  const driver =
    existingDriver ??
    (await tx.driver.create({
      data: {
        businessId,
        userId,
        code: 'L-01',
        firstName: 'Moussa',
        lastName: 'Keïta',
        phone: '+221 77 111 11 11',
        vehicleType: 'MOTORCYCLE',
        vehiclePlate: 'DK-1234-AB',
        deliveryFee: '2.00',
        isAvailable: true,
      },
    }));

  if (existingDriver === null) {
    counters.drivers += 1;
  }

  return finishDelivery(tx, businessId, currency, userId, locationId, orderTypeIdByCode, {
    counters,
    zoneId: zone.id,
    driverId: driver.id,
  });
}

interface DeliveryContext {
  counters: DeliveryCounters;
  zoneId: string;
  driverId: string;
}

const DELIVERY_FEE = '3.50';
const DRIVER_FEE = '2.00';

/** The order, the run, its timeline, and what the driver earned. */
async function finishDelivery(
  tx: TenantTransaction,
  businessId: string,
  currency: string,
  userId: string,
  locationId: string,
  orderTypeIdByCode: ReadonlyMap<string, string>,
  context: DeliveryContext,
): Promise<DeliveryCounters> {
  const { counters, zoneId, driverId } = context;

  const existing = await tx.delivery.findFirst({
    where: { businessId, order: { number: 'DEMO-0003' } },
    select: { id: true },
  });

  if (existing !== null) {
    return counters;
  }

  const orderTypeId = orderTypeIdByCode.get('delivery');
  const product = await tx.product.findFirst({
    where: { businessId, trackStock: true },
    select: { id: true, name: true, sku: true, price: true, vatRate: true },
    orderBy: { sku: 'asc' },
  });

  if (orderTypeId === undefined || product === null) {
    // Nothing sensible to deliver for this business.
    return counters;
  }

  const unitPrice = cents(product.price.toString());
  const tax = Math.round((unitPrice * Number(product.vatRate.toString())) / 100);
  const fee = cents(DELIVERY_FEE);
  const total = unitPrice + tax + fee;

  const now = new Date();
  const placedAt = new Date(now.getTime() - 90 * 60_000);
  const assignedAt = new Date(now.getTime() - 75 * 60_000);
  const pickedUpAt = new Date(now.getTime() - 60 * 60_000);
  const inTransitAt = new Date(now.getTime() - 50 * 60_000);
  const deliveredAt = new Date(now.getTime() - 20 * 60_000);

  const order = await tx.order.create({
    data: {
      businessId,
      locationId,
      orderTypeId,
      number: 'DEMO-0003',
      channel: 'PHONE',
      status: 'COMPLETED',
      placedAt,
      completedAt: deliveredAt,
      currency,
      subtotal: money(unitPrice),
      taxAmount: money(tax),
      deliveryFee: money(fee),
      total: money(total),
      // Paid on delivery, which is how most of these orders are settled.
      paidAmount: money(total),
      deliveryAddressLine: '12 rue de la Démo',
      deliveryCity: 'Dakar',
      deliveryPhone: '+221 77 222 22 22',
      note: 'Livraison de démonstration',
      createdById: userId,
    },
  });

  await tx.orderLine.create({
    data: {
      businessId,
      orderId: order.id,
      productId: product.id,
      name: product.name,
      sku: product.sku,
      quantity: '1.000',
      unitPrice: money(unitPrice),
      taxRate: product.vatRate.toString(),
      taxAmount: money(tax),
      lineTotal: money(unitPrice + tax),
      status: 'SERVED',
      sortOrder: 0,
    },
  });

  const delivery = await tx.delivery.create({
    data: {
      businessId,
      orderId: order.id,
      driverId,
      zoneId,
      status: 'DELIVERED',
      addressLine: '12 rue de la Démo',
      city: 'Dakar',
      phone: '+221 77 222 22 22',
      latitude: '14.692800',
      longitude: '-17.446700',
      distanceKm: '4.20',
      fee: DELIVERY_FEE,
      driverFee: DRIVER_FEE,
      currency,
      assignedAt,
      pickedUpAt,
      deliveredAt,
      recipientName: 'Client livraison (démonstration)',
      assignedById: userId,
    },
  });

  counters.deliveries += 1;

  // ── The timeline, in order ─────────────────────────────────────────────────
  const trail: { type: 'CREATED' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED'; at: Date; note?: string }[] = [
    { type: 'CREATED', at: placedAt },
    { type: 'ASSIGNED', at: assignedAt, note: 'Affectée à L-01' },
    { type: 'PICKED_UP', at: pickedUpAt },
    { type: 'IN_TRANSIT', at: inTransitAt },
    { type: 'DELIVERED', at: deliveredAt, note: 'Remise au client' },
  ];

  await tx.deliveryEvent.createMany({
    data: trail.map((event, index) => ({
      businessId,
      deliveryId: delivery.id,
      type: event.type,
      toStatus: ['PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'][index] as
        | 'PENDING'
        | 'ASSIGNED'
        | 'PICKED_UP'
        | 'IN_TRANSIT'
        | 'DELIVERED',
      note: event.note ?? null,
      actorUserId: userId,
      createdAt: event.at,
    })),
  });

  counters.deliveryEvents += trail.length;

  // ── What the driver earned ─────────────────────────────────────────────────
  // Signed amounts: the fee is positive, and a bonus is too. A DEDUCTION would carry its own minus,
  // so a settlement is a sum rather than a convention.
  const earnings = [
    { type: 'DELIVERY' as const, amount: DRIVER_FEE, note: `Course DEMO-0003` },
    { type: 'BONUS' as const, amount: '5.00', note: 'Prime soirée pluvieuse' },
  ];

  await tx.driverEarning.createMany({
    data: earnings.map((earning) => ({
      businessId,
      driverId,
      deliveryId: earning.type === 'DELIVERY' ? delivery.id : null,
      type: earning.type,
      amount: earning.amount,
      currency,
      status: 'APPROVED' as const,
      approvedById: userId,
      approvedAt: now,
      note: earning.note,
    })),
  });

  counters.driverEarnings += earnings.length;

  return counters;
}
