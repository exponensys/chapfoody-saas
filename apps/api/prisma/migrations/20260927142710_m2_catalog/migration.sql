-- CreateEnum
CREATE TYPE "product_unit" AS ENUM ('PIECE', 'KILOGRAM', 'GRAM', 'LITRE', 'MILLILITRE', 'PORTION', 'BOX', 'PACK');

-- CreateEnum
CREATE TYPE "price_channel" AS ENUM ('DINE_IN', 'TAKEAWAY', 'DELIVERY', 'ONLINE', 'B2B');

-- CreateEnum
CREATE TYPE "allergen_presence" AS ENUM ('CONTAINS', 'MAY_CONTAIN');

-- CreateEnum
CREATE TYPE "stock_movement_reason" AS ENUM ('PURCHASE', 'SALE', 'RETURN', 'WASTE', 'ADJUSTMENT', 'STOCK_COUNT', 'TRANSFER');

-- CreateEnum
CREATE TYPE "purchase_order_status" AS ENUM ('DRAFT', 'SENT', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELED');

-- CreateTable
CREATE TABLE "allergen" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(64) NOT NULL,
    "label_fr" VARCHAR(120) NOT NULL,
    "label_en" VARCHAR(120) NOT NULL,
    "icon" VARCHAR(64),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "allergen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_allergen" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "allergen_id" TEXT NOT NULL,
    "presence" "allergen_presence" NOT NULL DEFAULT 'CONTAINS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_allergen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "unit" "product_unit" NOT NULL DEFAULT 'KILOGRAM',
    "cost_per_unit" DECIMAL(14,2),
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "yield_factor" DECIMAL(5,3) NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utensil" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "cost" DECIMAL(14,2),
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "usable_uses" INTEGER,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utensil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" VARCHAR(200),
    "yield_quantity" DECIMAL(14,3) NOT NULL DEFAULT 1,
    "yield_unit" "product_unit" NOT NULL DEFAULT 'PORTION',
    "prep_minutes" INTEGER,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_line" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "recipe_id" TEXT NOT NULL,
    "ingredient_id" TEXT,
    "sub_recipe_id" TEXT,
    "quantity" DECIMAL(14,3) NOT NULL,
    "unit" "product_unit" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modifier_group" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "min_selections" INTEGER NOT NULL DEFAULT 0,
    "max_selections" INTEGER NOT NULL DEFAULT 1,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modifier_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modifier" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "modifier_group_id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "price_delta" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_modifier_group" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "modifier_group_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_modifier_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_category" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "name" VARCHAR(160) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_product" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collection_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "category_id" TEXT,
    "sku" VARCHAR(64) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "short_description" VARCHAR(300),
    "image_url" TEXT,
    "gallery_urls" TEXT[],
    "price" DECIMAL(14,2) NOT NULL,
    "cost_price" DECIMAL(14,2),
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "vat_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "unit" "product_unit" NOT NULL DEFAULT 'PIECE',
    "track_stock" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "sku" VARCHAR(64) NOT NULL,
    "barcode" VARCHAR(64),
    "price_override" DECIMAL(14,2),
    "track_stock" BOOLEAN NOT NULL DEFAULT true,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_list" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "channel" "price_channel" NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "valid_from" TIMESTAMP(3),
    "valid_until" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_list_item" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "price_list_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "variant_id" TEXT,
    "price" DECIMAL(14,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_list_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "allergen_key_key" ON "allergen"("key");

-- CreateIndex
CREATE INDEX "allergen_sort_order_idx" ON "allergen"("sort_order");

-- CreateIndex
CREATE INDEX "product_allergen_business_id_idx" ON "product_allergen"("business_id");

-- CreateIndex
CREATE INDEX "product_allergen_allergen_id_idx" ON "product_allergen"("allergen_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_allergen_product_id_allergen_id_key" ON "product_allergen"("product_id", "allergen_id");

-- CreateIndex
CREATE INDEX "ingredient_business_id_is_active_idx" ON "ingredient"("business_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "ingredient_business_id_name_key" ON "ingredient"("business_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "utensil_business_id_name_key" ON "utensil"("business_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_product_id_key" ON "recipe"("product_id");

-- CreateIndex
CREATE INDEX "recipe_business_id_is_active_idx" ON "recipe"("business_id", "is_active");

-- CreateIndex
CREATE INDEX "recipe_line_recipe_id_sort_order_idx" ON "recipe_line"("recipe_id", "sort_order");

-- CreateIndex
CREATE INDEX "recipe_line_business_id_idx" ON "recipe_line"("business_id");

-- CreateIndex
CREATE INDEX "recipe_line_ingredient_id_idx" ON "recipe_line"("ingredient_id");

-- CreateIndex
CREATE INDEX "modifier_group_business_id_is_active_sort_order_idx" ON "modifier_group"("business_id", "is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "modifier_group_business_id_name_key" ON "modifier_group"("business_id", "name");

-- CreateIndex
CREATE INDEX "modifier_business_id_idx" ON "modifier"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "modifier_modifier_group_id_name_key" ON "modifier"("modifier_group_id", "name");

-- CreateIndex
CREATE INDEX "product_modifier_group_business_id_idx" ON "product_modifier_group"("business_id");

-- CreateIndex
CREATE INDEX "product_modifier_group_modifier_group_id_idx" ON "product_modifier_group"("modifier_group_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_modifier_group_product_id_modifier_group_id_key" ON "product_modifier_group"("product_id", "modifier_group_id");

-- CreateIndex
CREATE INDEX "product_category_business_id_parent_id_sort_order_idx" ON "product_category"("business_id", "parent_id", "sort_order");

-- CreateIndex
CREATE INDEX "product_category_business_id_is_active_idx" ON "product_category"("business_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "product_category_business_id_slug_key" ON "product_category"("business_id", "slug");

-- CreateIndex
CREATE INDEX "collection_business_id_is_active_sort_order_idx" ON "collection"("business_id", "is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "collection_business_id_slug_key" ON "collection"("business_id", "slug");

-- CreateIndex
CREATE INDEX "collection_product_business_id_idx" ON "collection_product"("business_id");

-- CreateIndex
CREATE INDEX "collection_product_product_id_idx" ON "collection_product"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "collection_product_collection_id_product_id_key" ON "collection_product"("collection_id", "product_id");

-- CreateIndex
CREATE INDEX "product_business_id_category_id_sort_order_idx" ON "product"("business_id", "category_id", "sort_order");

-- CreateIndex
CREATE INDEX "product_business_id_is_active_is_published_idx" ON "product"("business_id", "is_active", "is_published");

-- CreateIndex
CREATE INDEX "product_business_id_deleted_at_idx" ON "product"("business_id", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "product_business_id_sku_key" ON "product"("business_id", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_business_id_slug_key" ON "product"("business_id", "slug");

-- CreateIndex
CREATE INDEX "product_variant_business_id_product_id_sort_order_idx" ON "product_variant"("business_id", "product_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_business_id_sku_key" ON "product_variant"("business_id", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_product_id_name_key" ON "product_variant"("product_id", "name");

-- CreateIndex
CREATE INDEX "price_list_business_id_channel_is_active_idx" ON "price_list"("business_id", "channel", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "price_list_business_id_name_key" ON "price_list"("business_id", "name");

-- CreateIndex
CREATE INDEX "price_list_item_business_id_idx" ON "price_list_item"("business_id");

-- CreateIndex
CREATE INDEX "price_list_item_price_list_id_idx" ON "price_list_item"("price_list_id");

-- CreateIndex
CREATE INDEX "price_list_item_product_id_idx" ON "price_list_item"("product_id");

-- CreateIndex
CREATE INDEX "price_list_item_variant_id_idx" ON "price_list_item"("variant_id");

-- AddForeignKey
ALTER TABLE "product_allergen" ADD CONSTRAINT "product_allergen_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_allergen" ADD CONSTRAINT "product_allergen_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_allergen" ADD CONSTRAINT "product_allergen_allergen_id_fkey" FOREIGN KEY ("allergen_id") REFERENCES "allergen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utensil" ADD CONSTRAINT "utensil_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_line" ADD CONSTRAINT "recipe_line_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_line" ADD CONSTRAINT "recipe_line_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_line" ADD CONSTRAINT "recipe_line_sub_recipe_id_fkey" FOREIGN KEY ("sub_recipe_id") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_line" ADD CONSTRAINT "recipe_line_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifier_group" ADD CONSTRAINT "modifier_group_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifier" ADD CONSTRAINT "modifier_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifier" ADD CONSTRAINT "modifier_modifier_group_id_fkey" FOREIGN KEY ("modifier_group_id") REFERENCES "modifier_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_modifier_group" ADD CONSTRAINT "product_modifier_group_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_modifier_group" ADD CONSTRAINT "product_modifier_group_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_modifier_group" ADD CONSTRAINT "product_modifier_group_modifier_group_id_fkey" FOREIGN KEY ("modifier_group_id") REFERENCES "modifier_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_category" ADD CONSTRAINT "product_category_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_category" ADD CONSTRAINT "product_category_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "product_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection" ADD CONSTRAINT "collection_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_product" ADD CONSTRAINT "collection_product_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_product" ADD CONSTRAINT "collection_product_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_product" ADD CONSTRAINT "collection_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_list" ADD CONSTRAINT "price_list_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_list_item" ADD CONSTRAINT "price_list_item_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_list_item" ADD CONSTRAINT "price_list_item_price_list_id_fkey" FOREIGN KEY ("price_list_id") REFERENCES "price_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_list_item" ADD CONSTRAINT "price_list_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_list_item" ADD CONSTRAINT "price_list_item_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ═════════════════════════════════════════════════════════════════════════════
-- Constraints Prisma cannot express in the schema.
--
-- These are the rules that make the data mean something. They live in the database rather
-- than in the application because a rule enforced only by the API is a rule that holds
-- until the first import script or manual statement forgets it.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── One price per target, per list ───────────────────────────────────────────
-- A price list may hold a price for a product (variant_id NULL) and prices for its
-- variants. A Prisma @@unique([price_list_id, product_id, variant_id]) would NOT enforce
-- that: PostgreSQL treats NULLs as distinct, so the same product-level price could be
-- inserted twice and both rows accepted. Partial indexes state the rule exactly.
CREATE UNIQUE INDEX "price_list_item_product_unique"
  ON "price_list_item" ("price_list_id", "product_id")
  WHERE "variant_id" IS NULL;

CREATE UNIQUE INDEX "price_list_item_variant_unique"
  ON "price_list_item" ("price_list_id", "variant_id")
  WHERE "variant_id" IS NOT NULL;

-- ── A recipe line consumes exactly one thing ─────────────────────────────────
-- Either an ingredient or a sub-recipe, never both and never neither. A line with neither
-- consumes nothing and would quietly understate every cost computed from the recipe; a
-- line with both would double-count. Prisma cannot express a mutual exclusion, so it is a
-- CHECK constraint.
ALTER TABLE "recipe_line" ADD CONSTRAINT "recipe_line_consumes_exactly_one"
  CHECK (
    ("ingredient_id" IS NOT NULL AND "sub_recipe_id" IS NULL)
    OR ("ingredient_id" IS NULL AND "sub_recipe_id" IS NOT NULL)
  );

-- ── A recipe cannot contain itself ───────────────────────────────────────────
-- The direct case, caught at the point of writing. Longer cycles (A → B → A) still need a
-- check when a recipe is saved, because no single-row constraint can see them.
ALTER TABLE "recipe_line" ADD CONSTRAINT "recipe_line_no_self_reference"
  CHECK ("sub_recipe_id" IS NULL OR "sub_recipe_id" <> "recipe_id");

-- ── Money, rates and quantities stay sane ────────────────────────────────────
-- Each of these defends a calculation. A negative price or an impossible VAT rate would
-- propagate into invoices and tax returns before anyone noticed.
ALTER TABLE "product" ADD CONSTRAINT "product_price_not_negative"
  CHECK ("price" >= 0);

ALTER TABLE "product" ADD CONSTRAINT "product_vat_rate_valid"
  CHECK ("vat_rate" >= 0 AND "vat_rate" <= 100);

ALTER TABLE "recipe_line" ADD CONSTRAINT "recipe_line_quantity_positive"
  CHECK ("quantity" > 0);

-- The yield factor divides costs, so zero would be a division by zero at report time.
ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_yield_factor_positive"
  CHECK ("yield_factor" > 0);

ALTER TABLE "modifier_group" ADD CONSTRAINT "modifier_group_selection_range"
  CHECK ("min_selections" >= 0 AND "max_selections" >= "min_selections");

