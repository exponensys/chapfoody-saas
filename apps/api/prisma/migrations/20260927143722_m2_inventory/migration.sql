-- CreateEnum
CREATE TYPE "stock_count_status" AS ENUM ('OPEN', 'CLOSED', 'CANCELED');

-- AlterTable
ALTER TABLE "ingredient" ADD COLUMN     "supplier_id" TEXT;

-- CreateTable
CREATE TABLE "stock_location" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "code" VARCHAR(32),
    "address_line" VARCHAR(200),
    "city" VARCHAR(120),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_item" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "product_id" TEXT,
    "variant_id" TEXT,
    "ingredient_id" TEXT,
    "quantity" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "reorder_point" DECIMAL(14,3),
    "reorder_quantity" DECIMAL(14,3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movement" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "product_id" TEXT,
    "variant_id" TEXT,
    "ingredient_id" TEXT,
    "reason" "stock_movement_reason" NOT NULL,
    "quantity_delta" DECIMAL(14,3) NOT NULL,
    "quantity_after" DECIMAL(14,3),
    "unit_cost" DECIMAL(14,2),
    "reference_type" VARCHAR(48),
    "reference_id" TEXT,
    "note" TEXT,
    "actor_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_count" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "reference" VARCHAR(120),
    "status" "stock_count_status" NOT NULL DEFAULT 'OPEN',
    "started_at" TIMESTAMP(3) NOT NULL,
    "closed_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_count_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_count_line" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "stock_count_id" TEXT NOT NULL,
    "product_id" TEXT,
    "variant_id" TEXT,
    "ingredient_id" TEXT,
    "expected_quantity" DECIMAL(14,3) NOT NULL,
    "counted_quantity" DECIMAL(14,3) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_count_line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "contact_name" VARCHAR(160),
    "email" VARCHAR(320),
    "phone" VARCHAR(32),
    "address_line" VARCHAR(200),
    "city" VARCHAR(120),
    "country" CHAR(2),
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_product" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "product_id" TEXT,
    "ingredient_id" TEXT,
    "supplier_sku" VARCHAR(64),
    "unit_cost" DECIMAL(14,2),
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "lead_time_days" INTEGER,
    "min_order_quantity" DECIMAL(14,3),
    "is_preferred" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "location_id" TEXT,
    "number" VARCHAR(32) NOT NULL,
    "status" "purchase_order_status" NOT NULL DEFAULT 'DRAFT',
    "ordered_at" TIMESTAMP(3),
    "expected_at" TIMESTAMP(3),
    "received_at" TIMESTAMP(3),
    "subtotal" DECIMAL(14,2) NOT NULL,
    "tax_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(14,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "notes" TEXT,
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_line" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "purchase_order_id" TEXT NOT NULL,
    "product_id" TEXT,
    "ingredient_id" TEXT,
    "description" VARCHAR(200) NOT NULL,
    "quantity" DECIMAL(14,3) NOT NULL,
    "unit" "product_unit" NOT NULL,
    "unit_cost" DECIMAL(14,2) NOT NULL,
    "line_total" DECIMAL(14,2) NOT NULL,
    "received_quantity" DECIMAL(14,3),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_order_line_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "stock_location_business_id_is_active_name_idx" ON "stock_location"("business_id", "is_active", "name");

-- CreateIndex
CREATE UNIQUE INDEX "stock_location_business_id_name_key" ON "stock_location"("business_id", "name");

-- CreateIndex
CREATE INDEX "stock_item_business_id_location_id_idx" ON "stock_item"("business_id", "location_id");

-- CreateIndex
CREATE INDEX "stock_item_product_id_idx" ON "stock_item"("product_id");

-- CreateIndex
CREATE INDEX "stock_item_ingredient_id_idx" ON "stock_item"("ingredient_id");

-- CreateIndex
CREATE INDEX "stock_movement_business_id_created_at_idx" ON "stock_movement"("business_id", "created_at");

-- CreateIndex
CREATE INDEX "stock_movement_business_id_product_id_created_at_idx" ON "stock_movement"("business_id", "product_id", "created_at");

-- CreateIndex
CREATE INDEX "stock_movement_business_id_ingredient_id_created_at_idx" ON "stock_movement"("business_id", "ingredient_id", "created_at");

-- CreateIndex
CREATE INDEX "stock_movement_reference_type_reference_id_idx" ON "stock_movement"("reference_type", "reference_id");

-- CreateIndex
CREATE INDEX "stock_count_business_id_status_started_at_idx" ON "stock_count"("business_id", "status", "started_at");

-- CreateIndex
CREATE INDEX "stock_count_line_stock_count_id_idx" ON "stock_count_line"("stock_count_id");

-- CreateIndex
CREATE INDEX "stock_count_line_business_id_idx" ON "stock_count_line"("business_id");

-- CreateIndex
CREATE INDEX "supplier_business_id_is_active_name_idx" ON "supplier"("business_id", "is_active", "name");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_business_id_name_key" ON "supplier"("business_id", "name");

-- CreateIndex
CREATE INDEX "supplier_product_business_id_idx" ON "supplier_product"("business_id");

-- CreateIndex
CREATE INDEX "supplier_product_supplier_id_idx" ON "supplier_product"("supplier_id");

-- CreateIndex
CREATE INDEX "supplier_product_product_id_idx" ON "supplier_product"("product_id");

-- CreateIndex
CREATE INDEX "supplier_product_ingredient_id_idx" ON "supplier_product"("ingredient_id");

-- CreateIndex
CREATE INDEX "purchase_order_business_id_status_ordered_at_idx" ON "purchase_order"("business_id", "status", "ordered_at");

-- CreateIndex
CREATE INDEX "purchase_order_supplier_id_idx" ON "purchase_order"("supplier_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_order_business_id_number_key" ON "purchase_order"("business_id", "number");

-- CreateIndex
CREATE INDEX "purchase_order_line_purchase_order_id_sort_order_idx" ON "purchase_order_line"("purchase_order_id", "sort_order");

-- CreateIndex
CREATE INDEX "purchase_order_line_business_id_idx" ON "purchase_order_line"("business_id");

-- CreateIndex
CREATE INDEX "ingredient_supplier_id_idx" ON "ingredient"("supplier_id");

-- AddForeignKey
ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_location" ADD CONSTRAINT "stock_location_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_item" ADD CONSTRAINT "stock_item_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_item" ADD CONSTRAINT "stock_item_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "stock_location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_item" ADD CONSTRAINT "stock_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_item" ADD CONSTRAINT "stock_item_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_item" ADD CONSTRAINT "stock_item_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "stock_location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_count" ADD CONSTRAINT "stock_count_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_count" ADD CONSTRAINT "stock_count_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "stock_location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_count_line" ADD CONSTRAINT "stock_count_line_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_count_line" ADD CONSTRAINT "stock_count_line_stock_count_id_fkey" FOREIGN KEY ("stock_count_id") REFERENCES "stock_count"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_count_line" ADD CONSTRAINT "stock_count_line_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_count_line" ADD CONSTRAINT "stock_count_line_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier" ADD CONSTRAINT "supplier_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_product" ADD CONSTRAINT "supplier_product_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_product" ADD CONSTRAINT "supplier_product_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_product" ADD CONSTRAINT "supplier_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_product" ADD CONSTRAINT "supplier_product_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order" ADD CONSTRAINT "purchase_order_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order" ADD CONSTRAINT "purchase_order_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order" ADD CONSTRAINT "purchase_order_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "stock_location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order" ADD CONSTRAINT "purchase_order_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_line" ADD CONSTRAINT "purchase_order_line_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_line" ADD CONSTRAINT "purchase_order_line_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_line" ADD CONSTRAINT "purchase_order_line_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_line" ADD CONSTRAINT "purchase_order_line_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ═════════════════════════════════════════════════════════════════════════════
-- Constraints Prisma cannot express, for stock and purchasing.
--
-- Three shapes recur here and Prisma's schema language has no way to state any of them:
-- a polymorphic target, uniqueness that must ignore NULLs, and "at most one true row".
-- Each one defends a rule the application would otherwise have to remember forever.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── A polymorphic target is exactly one thing ────────────────────────────────
-- Stock, stock counts, purchase order lines and supplier catalogues each point at a
-- product, a variant or an ingredient. `num_nonnulls` is a PostgreSQL built-in, which
-- makes the rule a one-liner: exactly one of the columns must be set.
--
-- Without these, a row could point at nothing (a stock item that stocks nothing) or at two
-- things at once (a purchase order line billing the same good twice), and every total
-- computed from the table would be quietly wrong.
ALTER TABLE "stock_item" ADD CONSTRAINT "stock_item_targets_exactly_one"
  CHECK (num_nonnulls("product_id", "variant_id", "ingredient_id") = 1);

ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_targets_exactly_one"
  CHECK (num_nonnulls("product_id", "variant_id", "ingredient_id") = 1);

ALTER TABLE "stock_count_line" ADD CONSTRAINT "stock_count_line_targets_exactly_one"
  CHECK (num_nonnulls("product_id", "variant_id", "ingredient_id") = 1);

ALTER TABLE "supplier_product" ADD CONSTRAINT "supplier_product_targets_exactly_one"
  CHECK (num_nonnulls("product_id", "ingredient_id") = 1);

ALTER TABLE "purchase_order_line" ADD CONSTRAINT "purchase_order_line_targets_exactly_one"
  CHECK (num_nonnulls("product_id", "ingredient_id") = 1);

-- ── Uniqueness that has to ignore NULLs ──────────────────────────────────────
-- One row per item per location, one per item per supplier, one per item per stock count.
-- A plain compound unique cannot say this: PostgreSQL treats NULLs as distinct, so the
-- same product could be stocked twice at the same location and both rows accepted.
--
-- `location_id` leads the index because every read is "what is at this location".
CREATE UNIQUE INDEX "stock_item_location_product_unique"
  ON "stock_item" ("location_id", "product_id")
  WHERE "product_id" IS NOT NULL AND "variant_id" IS NULL;

CREATE UNIQUE INDEX "stock_item_location_variant_unique"
  ON "stock_item" ("location_id", "variant_id")
  WHERE "variant_id" IS NOT NULL;

CREATE UNIQUE INDEX "stock_item_location_ingredient_unique"
  ON "stock_item" ("location_id", "ingredient_id")
  WHERE "ingredient_id" IS NOT NULL;

CREATE UNIQUE INDEX "stock_count_line_product_unique"
  ON "stock_count_line" ("stock_count_id", "product_id")
  WHERE "product_id" IS NOT NULL;

CREATE UNIQUE INDEX "stock_count_line_ingredient_unique"
  ON "stock_count_line" ("stock_count_id", "ingredient_id")
  WHERE "ingredient_id" IS NOT NULL;

CREATE UNIQUE INDEX "supplier_product_product_unique"
  ON "supplier_product" ("supplier_id", "product_id")
  WHERE "product_id" IS NOT NULL;

CREATE UNIQUE INDEX "supplier_product_ingredient_unique"
  ON "supplier_product" ("supplier_id", "ingredient_id")
  WHERE "ingredient_id" IS NOT NULL;

-- ── At most one default location per business ────────────────────────────────
-- The condition "unique when true" is what a partial index is for. Two default locations
-- would make "where does this delivery go?" ambiguous, and the ambiguity would surface as
-- intermittent mis-stocked inventory rather than as an error.
CREATE UNIQUE INDEX "stock_location_one_default_per_business"
  ON "stock_location" ("business_id")
  WHERE "is_default";

-- ── Amounts and quantities ───────────────────────────────────────────────────
-- NOTE: stock_item.quantity is deliberately NOT constrained to be non-negative. Selling
-- the last item and then recording one more sale is normal in a busy service, and a
-- negative count is how the system records "we owe this item" — forbidding it would push
-- real shops into faking their numbers. The reports surface negative stock instead.
ALTER TABLE "purchase_order_line" ADD CONSTRAINT "purchase_order_line_quantity_positive"
  CHECK ("quantity" > 0);

ALTER TABLE "purchase_order_line" ADD CONSTRAINT "purchase_order_line_amounts_not_negative"
  CHECK ("unit_cost" >= 0 AND "line_total" >= 0);

ALTER TABLE "purchase_order" ADD CONSTRAINT "purchase_order_amounts_not_negative"
  CHECK ("subtotal" >= 0 AND "tax_amount" >= 0 AND "total" >= 0);

ALTER TABLE "supplier_product" ADD CONSTRAINT "supplier_product_cost_not_negative"
  CHECK ("unit_cost" IS NULL OR "unit_cost" >= 0);

