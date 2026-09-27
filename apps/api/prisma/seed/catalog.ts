/**
 * Persists one business's demo catalogue.
 *
 * Called from inside `runAsTenant`, so every write here is subject to the same row-level
 * security a request would be. That is deliberate: if a policy were wrong, the seed would
 * fail loudly rather than insert around it.
 *
 * Upserts throughout, keyed on the same natural keys the application uses (`businessId +
 * sku`, `businessId + slug`, `businessId + name`), so re-running the seed leaves the
 * database unchanged. The one exception is recipe lines, which have no natural key and are
 * replaced wholesale — which is what editing a recipe does anyway.
 */

import type { TenantTransaction } from '../../src/infra/prisma/tenant-context.js';
import type { DemoCatalog } from './catalog-types.js';

export interface CatalogCounters {
  categories: number;
  products: number;
  ingredients: number;
  modifiers: number;
}

/** A storefront-friendly slug: accent-free, lower-case, hyphenated. */
function slugify(value: string): string {
  return value
    .normalize('NFD')
    // Strip combining marks, so "grillé" becomes "grille" rather than "grill-".
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function seedCatalog(
  tx: TenantTransaction,
  businessId: string,
  currency: string,
  catalog: DemoCatalog,
): Promise<CatalogCounters> {
  const counters: CatalogCounters = { categories: 0, products: 0, ingredients: 0, modifiers: 0 };
  const productIdBySku = new Map<string, string>();
  const ingredientIdByName = new Map<string, string>();

  // ── Categories and products ────────────────────────────────────────────────
  for (const [categoryIndex, category] of catalog.categories.entries()) {
    const categoryData = {
      name: category.name,
      sortOrder: categoryIndex,
      isActive: true,
    };

    const categoryRow = await tx.productCategory.upsert({
      where: { businessId_slug: { businessId, slug: category.slug } },
      create: { businessId, slug: category.slug, ...categoryData },
      update: categoryData,
    });
    counters.categories += 1;

    for (const [productIndex, product] of category.products.entries()) {
      const productData = {
        name: product.name,
        categoryId: categoryRow.id,
        // A string into DECIMAL(14,2) — never a JS float.
        price: product.price,
        costPrice: product.costPrice ?? null,
        currency,
        vatRate: product.vatRate ?? '0',
        unit: product.unit ?? 'PIECE',
        trackStock: product.trackStock ?? true,
        isActive: true,
        isPublished: product.isPublished ?? false,
        sortOrder: productIndex,
      };

      const productRow = await tx.product.upsert({
        where: { businessId_sku: { businessId, sku: product.sku } },
        create: { businessId, sku: product.sku, slug: slugify(product.name), ...productData },
        update: productData,
      });

      productIdBySku.set(product.sku, productRow.id);
      counters.products += 1;
    }
  }

  // ── Ingredients ────────────────────────────────────────────────────────────
  for (const ingredient of catalog.ingredients ?? []) {
    const ingredientData = {
      unit: ingredient.unit,
      costPerUnit: ingredient.costPerUnit,
      currency,
      isActive: true,
    };

    const row = await tx.ingredient.upsert({
      where: { businessId_name: { businessId, name: ingredient.name } },
      create: { businessId, name: ingredient.name, ...ingredientData },
      update: ingredientData,
    });

    ingredientIdByName.set(ingredient.name, row.id);
    counters.ingredients += 1;
  }

  // ── Recipe: a bill of materials, replaced as a whole ───────────────────────
  if (catalog.recipe !== undefined) {
    const productId = productIdBySku.get(catalog.recipe.productSku);

    if (productId === undefined) {
      throw new Error(`Demo recipe references unknown product SKU "${catalog.recipe.productSku}".`);
    }

    const recipeData = {
      yieldQuantity: catalog.recipe.yieldQuantity,
      yieldUnit: catalog.recipe.yieldUnit,
      isActive: true,
    };

    const recipe = await tx.recipe.upsert({
      where: { productId },
      create: { businessId, productId, ...recipeData },
      update: recipeData,
    });

    await tx.recipeLine.deleteMany({ where: { recipeId: recipe.id } });

    await tx.recipeLine.createMany({
      data: catalog.recipe.lines.map((line, index) => {
        const ingredientId = ingredientIdByName.get(line.ingredient);

        if (ingredientId === undefined) {
          throw new Error(`Demo recipe line references unknown ingredient "${line.ingredient}".`);
        }

        return {
          businessId,
          recipeId: recipe.id,
          ingredientId,
          quantity: line.quantity,
          unit: line.unit,
          sortOrder: index,
        };
      }),
    });
  }

  // ── A modifier group offered with one product ──────────────────────────────
  if (catalog.modifierGroup !== undefined) {
    const group = catalog.modifierGroup;
    const groupData = {
      minSelections: group.minSelections,
      maxSelections: group.maxSelections,
      // Required when a choice is mandatory — derived here so the two cannot contradict.
      isRequired: group.minSelections > 0,
      isActive: true,
    };

    const groupRow = await tx.modifierGroup.upsert({
      where: { businessId_name: { businessId, name: group.name } },
      create: { businessId, name: group.name, ...groupData },
      update: groupData,
    });

    for (const [index, modifier] of group.modifiers.entries()) {
      const modifierData = { priceDelta: modifier.priceDelta, sortOrder: index, isActive: true };

      await tx.modifier.upsert({
        where: { modifierGroupId_name: { modifierGroupId: groupRow.id, name: modifier.name } },
        create: { businessId, modifierGroupId: groupRow.id, name: modifier.name, ...modifierData },
        update: modifierData,
      });

      counters.modifiers += 1;
    }

    const attachedProductId = productIdBySku.get(group.attachedTo);

    if (attachedProductId === undefined) {
      throw new Error(`Demo modifier group references unknown product SKU "${group.attachedTo}".`);
    }

    await tx.productModifierGroup.upsert({
      where: {
        productId_modifierGroupId: { productId: attachedProductId, modifierGroupId: groupRow.id },
      },
      create: { businessId, productId: attachedProductId, modifierGroupId: groupRow.id },
      update: {},
    });
  }

  return counters;
}
