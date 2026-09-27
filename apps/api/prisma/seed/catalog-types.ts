/**
 * Shapes for the demo catalogue data.
 *
 * Separate from the data itself so the data files can import them without a cycle: the
 * aggregate in catalog-data.ts imports the data, and the data imports only these types.
 */

export type DemoUnit =
  | 'PIECE'
  | 'KILOGRAM'
  | 'GRAM'
  | 'LITRE'
  | 'MILLILITRE'
  | 'PORTION'
  | 'BOX'
  | 'PACK';

export interface DemoProduct {
  readonly sku: string;
  readonly name: string;
  /** A string, never a number: this is written into DECIMAL(14,2). */
  readonly price: string;
  readonly unit?: DemoUnit;
  readonly vatRate?: string;
  readonly costPrice?: string;
  /** False for services, which do not move stock. */
  readonly trackStock?: boolean;
  readonly isPublished?: boolean;
}

export interface DemoCategory {
  readonly name: string;
  readonly slug: string;
  readonly products: readonly DemoProduct[];
}

export interface DemoIngredient {
  readonly name: string;
  readonly unit: DemoUnit;
  readonly costPerUnit: string;
}

export interface DemoModifierGroup {
  readonly name: string;
  readonly minSelections: number;
  readonly maxSelections: number;
  readonly modifiers: readonly { readonly name: string; readonly priceDelta: string }[];
  /** SKU of the product the group is offered with. */
  readonly attachedTo: string;
}

export interface DemoRecipe {
  readonly productSku: string;
  readonly yieldQuantity: string;
  readonly yieldUnit: DemoUnit;
  readonly lines: readonly {
    readonly ingredient: string;
    readonly quantity: string;
    readonly unit: DemoUnit;
  }[];
}

export interface DemoCatalog {
  readonly categories: readonly DemoCategory[];
  readonly ingredients?: readonly DemoIngredient[];
  readonly recipe?: DemoRecipe;
  readonly modifierGroup?: DemoModifierGroup;
}
