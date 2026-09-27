/**
 * Demo stock and purchasing, written inside the tenant transaction like everything else.
 *
 * ── What gets stocked, and why it differs ────────────────────────────────────
 * A restaurant's inventory is its raw ingredients, not its dishes: "Poulet braisé" is made
 * to order and never sits on a shelf. A shop's inventory is its products. Deciding that
 * from the catalogue — ingredients present means a kitchen — keeps the demo honest, and it
 * exercises both branches of a decision the application itself will have to make.
 *
 * Every opening quantity is written as a PURCHASE movement rather than by setting a number
 * directly, because the ledger is the source of truth: a stock level with no movement
 * behind it is a level nobody can explain.
 */

import type { TenantTransaction } from '../../src/infra/prisma/tenant-context.js';
import type { DemoCatalog } from './catalog-types.js';

export interface StockCounters {
  locations: number;
  items: number;
  movements: number;
  suppliers: number;
  /** The default location, so the sales seed can put orders at it. */
  locationId: string;
}

/** Opening quantities, per unit of measure. Small enough to be readable, real enough to sell. */
const OPENING_STOCK = { PIECE: '24', KILOGRAM: '10', GRAM: '500', LITRE: '8', MILLILITRE: '250', PORTION: '12', BOX: '6', PACK: '12' } as const;

export async function seedStock(
  tx: TenantTransaction,
  businessId: string,
  currency: string,
  catalog: DemoCatalog,
  locationName: string,
): Promise<StockCounters> {
  const counters: StockCounters = { locations: 0, items: 0, movements: 0, suppliers: 0, locationId: '' };

  const location = await tx.stockLocation.upsert({
    where: { businessId_name: { businessId, name: locationName } },
    create: { businessId, name: locationName, isDefault: true, isActive: true },
    update: { isDefault: true, isActive: true },
  });
  counters.locations += 1;
  counters.locationId = location.id;

  // A kitchen is stocked by ingredient; a shop by product. See the note at the top.
  const stockIngredients = (catalog.ingredients?.length ?? 0) > 0;

  const targets = stockIngredients
    ? (catalog.ingredients ?? []).map((ingredient) => ({ kind: 'ingredient' as const, name: ingredient.name, unit: ingredient.unit, cost: ingredient.costPerUnit }))
    : catalog.categories
        .flatMap((category) => category.products)
        .filter((product) => product.trackStock !== false)
        .map((product) => ({ kind: 'product' as const, name: product.name, unit: product.unit ?? 'PIECE', cost: product.costPrice ?? '0.00' }));

  const supplier = await tx.supplier.upsert({
    where: { businessId_name: { businessId, name: 'Fournisseur de démonstration' } },
    create: {
      businessId,
      name: 'Fournisseur de démonstration',
      contactName: 'Service commercial',
      email: 'commandes@fournisseur.test',
      city: 'Dakar',
      country: 'SN',
      isActive: true,
    },
    update: { isActive: true },
  });
  counters.suppliers += 1;

  for (const target of targets) {
    const quantity = OPENING_STOCK[target.unit];

    // Resolve the row by name. `findFirst` rather than `findUnique` because the lookup is
    // by a non-unique field, and the scoping extension adds the tenant filter on top.
    const owner =
      target.kind === 'ingredient'
        ? await tx.ingredient.findFirst({ where: { name: target.name }, select: { id: true } })
        : await tx.product.findFirst({ where: { name: target.name }, select: { id: true } });

    if (owner === null) {
      continue;
    }

    const targetColumn =
      target.kind === 'ingredient' ? { ingredientId: owner.id } : { productId: owner.id };

    // `findFirst` + `create` rather than `upsert`: the uniqueness of a stock item rests on
    // a PARTIAL index (which Prisma cannot name as an upsert key), so the existence check
    // is explicit and a re-run simply finds the row already there.
    const existing = await tx.stockItem.findFirst({
      where: { businessId, locationId: location.id, ...targetColumn },
      select: { id: true },
    });

    if (existing === null) {
      await tx.stockItem.create({
        data: {
          businessId,
          locationId: location.id,
          ...targetColumn,
          quantity,
          reorderPoint: '3',
          reorderQuantity: quantity,
        },
      });

      await tx.stockMovement.create({
        data: {
          businessId,
          locationId: location.id,
          ...targetColumn,
          reason: 'PURCHASE',
          quantityDelta: quantity,
          quantityAfter: quantity,
          unitCost: target.cost,
          referenceType: 'seed',
          note: 'Stock initial (démonstration)',
        },
      });

      counters.items += 1;
      counters.movements += 1;
    }

    // The supplier catalogue, so a reorder screen has something to suggest.
    const alreadyListed = await tx.supplierProduct.findFirst({
      where: { businessId, supplierId: supplier.id, ...targetColumn },
      select: { id: true },
    });

    if (alreadyListed === null) {
      await tx.supplierProduct.create({
        data: {
          businessId,
          supplierId: supplier.id,
          ...targetColumn,
          unitCost: target.cost,
          currency,
          leadTimeDays: 3,
          isPreferred: true,
        },
      });
    }
  }

  return counters;
}
