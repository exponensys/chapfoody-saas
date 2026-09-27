-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('OPEN', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "order_channel" AS ENUM ('POS', 'STOREFRONT', 'PHONE', 'MARKETPLACE');

-- CreateEnum
CREATE TYPE "order_line_status" AS ENUM ('PENDING', 'PREPARING', 'READY', 'SERVED', 'CANCELED');

-- CreateEnum
CREATE TYPE "table_status" AS ENUM ('FREE', 'OCCUPIED', 'RESERVED', 'CLEANING', 'OUT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "reservation_status" AS ENUM ('PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "tender_method" AS ENUM ('CASH', 'CARD', 'MOBILE_MONEY', 'TRANSFER', 'MEAL_VOUCHER', 'LOYALTY_POINTS', 'GIFT_CARD');

-- CreateEnum
CREATE TYPE "tender_status" AS ENUM ('PENDING', 'CAPTURED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "cash_movement_reason" AS ENUM ('OPENING_FLOAT', 'CASH_SALE', 'WITHDRAWAL', 'DEPOSIT', 'EXPENSE', 'TIP', 'REFUND', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "pos_session_status" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "vat_declaration_status" AS ENUM ('DRAFT', 'FILED', 'PAID');

-- CreateTable
CREATE TABLE "restaurant_table" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "location_id" TEXT,
    "name" VARCHAR(64) NOT NULL,
    "zone" VARCHAR(120),
    "capacity" INTEGER NOT NULL DEFAULT 2,
    "status" "table_status" NOT NULL DEFAULT 'FREE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restaurant_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "table_id" TEXT,
    "customer_name" VARCHAR(160) NOT NULL,
    "customer_phone" VARCHAR(32),
    "customer_email" VARCHAR(320),
    "party_size" INTEGER NOT NULL,
    "reserved_at" TIMESTAMP(3) NOT NULL,
    "duration_minutes" INTEGER NOT NULL DEFAULT 120,
    "status" "reservation_status" NOT NULL DEFAULT 'PENDING',
    "deposit_amount" DECIMAL(14,2),
    "note" TEXT,
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pickup_point" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "location_id" TEXT,
    "name" VARCHAR(160) NOT NULL,
    "instructions" TEXT,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pickup_point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_type" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "requires_table" BOOLEAN NOT NULL DEFAULT false,
    "requires_delivery_address" BOOLEAN NOT NULL DEFAULT false,
    "default_delivery_fee" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_order" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "location_id" TEXT,
    "order_type_id" TEXT NOT NULL,
    "table_id" TEXT,
    "pickup_point_id" TEXT,
    "reservation_id" TEXT,
    "number" VARCHAR(32) NOT NULL,
    "channel" "order_channel" NOT NULL DEFAULT 'POS',
    "status" "order_status" NOT NULL DEFAULT 'OPEN',
    "guest_count" INTEGER,
    "placed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduled_for" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "cancel_reason" VARCHAR(200),
    "subtotal" DECIMAL(14,2) NOT NULL,
    "discount_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "service_fee" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "delivery_fee" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tip_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "rounding_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(14,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "paid_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "note" TEXT,
    "delivery_address_line" VARCHAR(200),
    "delivery_city" VARCHAR(120),
    "delivery_phone" VARCHAR(32),
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_line" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT,
    "variant_id" TEXT,
    "name" VARCHAR(200) NOT NULL,
    "sku" VARCHAR(64),
    "quantity" DECIMAL(14,3) NOT NULL,
    "unit_price" DECIMAL(14,2) NOT NULL,
    "unit_cost" DECIMAL(14,2),
    "discount_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tax_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "line_total" DECIMAL(14,2) NOT NULL,
    "status" "order_line_status" NOT NULL DEFAULT 'PENDING',
    "course_number" INTEGER,
    "note" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_line_modifier" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "order_line_id" TEXT NOT NULL,
    "modifier_id" TEXT,
    "name" VARCHAR(160) NOT NULL,
    "price_delta" DECIMAL(14,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_line_modifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_status_history" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "from_status" "order_status",
    "to_status" "order_status" NOT NULL,
    "changed_by_id" TEXT,
    "reason" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "restaurant_table_business_id_status_sort_order_idx" ON "restaurant_table"("business_id", "status", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_table_business_id_name_key" ON "restaurant_table"("business_id", "name");

-- CreateIndex
CREATE INDEX "reservation_business_id_reserved_at_idx" ON "reservation"("business_id", "reserved_at");

-- CreateIndex
CREATE INDEX "reservation_business_id_status_reserved_at_idx" ON "reservation"("business_id", "status", "reserved_at");

-- CreateIndex
CREATE INDEX "reservation_table_id_reserved_at_idx" ON "reservation"("table_id", "reserved_at");

-- CreateIndex
CREATE INDEX "pickup_point_business_id_is_active_idx" ON "pickup_point"("business_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "pickup_point_business_id_name_key" ON "pickup_point"("business_id", "name");

-- CreateIndex
CREATE INDEX "order_type_business_id_is_active_sort_order_idx" ON "order_type"("business_id", "is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "order_type_business_id_code_key" ON "order_type"("business_id", "code");

-- CreateIndex
CREATE INDEX "customer_order_business_id_status_placed_at_idx" ON "customer_order"("business_id", "status", "placed_at");

-- CreateIndex
CREATE INDEX "customer_order_business_id_placed_at_idx" ON "customer_order"("business_id", "placed_at");

-- CreateIndex
CREATE INDEX "customer_order_business_id_order_type_id_placed_at_idx" ON "customer_order"("business_id", "order_type_id", "placed_at");

-- CreateIndex
CREATE INDEX "customer_order_table_id_idx" ON "customer_order"("table_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_order_business_id_number_key" ON "customer_order"("business_id", "number");

-- CreateIndex
CREATE INDEX "order_line_order_id_sort_order_idx" ON "order_line"("order_id", "sort_order");

-- CreateIndex
CREATE INDEX "order_line_business_id_idx" ON "order_line"("business_id");

-- CreateIndex
CREATE INDEX "order_line_product_id_idx" ON "order_line"("product_id");

-- CreateIndex
CREATE INDEX "order_line_modifier_order_line_id_idx" ON "order_line_modifier"("order_line_id");

-- CreateIndex
CREATE INDEX "order_line_modifier_business_id_idx" ON "order_line_modifier"("business_id");

-- CreateIndex
CREATE INDEX "order_status_history_order_id_created_at_idx" ON "order_status_history"("order_id", "created_at");

-- CreateIndex
CREATE INDEX "order_status_history_business_id_created_at_idx" ON "order_status_history"("business_id", "created_at");

-- AddForeignKey
ALTER TABLE "restaurant_table" ADD CONSTRAINT "restaurant_table_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_table" ADD CONSTRAINT "restaurant_table_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "stock_location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "restaurant_table"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_point" ADD CONSTRAINT "pickup_point_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_point" ADD CONSTRAINT "pickup_point_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "stock_location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_type" ADD CONSTRAINT "order_type_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_order" ADD CONSTRAINT "customer_order_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_order" ADD CONSTRAINT "customer_order_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "stock_location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_order" ADD CONSTRAINT "customer_order_order_type_id_fkey" FOREIGN KEY ("order_type_id") REFERENCES "order_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_order" ADD CONSTRAINT "customer_order_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "restaurant_table"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_order" ADD CONSTRAINT "customer_order_pickup_point_id_fkey" FOREIGN KEY ("pickup_point_id") REFERENCES "pickup_point"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_order" ADD CONSTRAINT "customer_order_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_order" ADD CONSTRAINT "customer_order_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_line" ADD CONSTRAINT "order_line_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_line" ADD CONSTRAINT "order_line_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "customer_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_line" ADD CONSTRAINT "order_line_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_line" ADD CONSTRAINT "order_line_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_line_modifier" ADD CONSTRAINT "order_line_modifier_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_line_modifier" ADD CONSTRAINT "order_line_modifier_order_line_id_fkey" FOREIGN KEY ("order_line_id") REFERENCES "order_line"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_line_modifier" ADD CONSTRAINT "order_line_modifier_modifier_id_fkey" FOREIGN KEY ("modifier_id") REFERENCES "modifier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "customer_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ═════════════════════════════════════════════════════════════════════════════
-- Constraints Prisma cannot express, for sales.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── An order's total must reconcile with its parts ───────────────────────────
-- This is the one rule that makes a receipt trustworthy. If a future feature adds a fee and
-- forgets this CHECK, the insert fails loudly at the moment of sale rather than producing a
-- receipt whose lines do not add up — which is the kind of defect that is discovered by an
-- auditor, months later, with no way to tell which side was wrong.
--
-- The formula is exactly the one the application computes, and the seed asserts it:
--   subtotal − discount + tax + service fee + delivery fee + tip − rounding = total
ALTER TABLE "customer_order" ADD CONSTRAINT "customer_order_total_reconciles"
  CHECK (
    round("subtotal" - "discount_amount" + "tax_amount" + "service_fee"
          + "delivery_fee" + "tip_amount" - "rounding_amount", 2) = "total"
  );

-- ── An order line's total must reconcile too ─────────────────────────────────
-- quantity × unitPrice − discount + tax. Rounded to two decimals because a fractional
-- quantity (0.333 kg) produces more precision than a currency has.
ALTER TABLE "order_line" ADD CONSTRAINT "order_line_total_reconciles"
  CHECK (
    round("quantity" * "unit_price" - "discount_amount" + "tax_amount", 2) = "line_total"
  );

-- ── Amounts and quantities stay sane ─────────────────────────────────────────
-- A negative price would let a sale pay the customer; a negative quantity would let someone
-- buy minus two sandwiches and credit themselves. Both are the kind of thing a bug produces
-- once and nobody notices for a week.
ALTER TABLE "customer_order" ADD CONSTRAINT "customer_order_amounts_not_negative"
  CHECK (
    "subtotal" >= 0 AND "discount_amount" >= 0 AND "tax_amount" >= 0
    AND "service_fee" >= 0 AND "delivery_fee" >= 0 AND "tip_amount" >= 0
    AND "paid_amount" >= 0
  );

ALTER TABLE "customer_order" ADD CONSTRAINT "customer_order_guest_count_positive"
  CHECK ("guest_count" IS NULL OR "guest_count" > 0);

ALTER TABLE "order_line" ADD CONSTRAINT "order_line_quantity_positive"
  CHECK ("quantity" > 0);

ALTER TABLE "order_line" ADD CONSTRAINT "order_line_amounts_not_negative"
  CHECK ("unit_price" >= 0 AND "discount_amount" >= 0 AND "tax_amount" >= 0);

ALTER TABLE "reservation" ADD CONSTRAINT "reservation_party_size_positive"
  CHECK ("party_size" > 0);

ALTER TABLE "reservation" ADD CONSTRAINT "reservation_duration_positive"
  CHECK ("duration_minutes" > 0);

ALTER TABLE "restaurant_table" ADD CONSTRAINT "restaurant_table_capacity_positive"
  CHECK ("capacity" > 0);

ALTER TABLE "order_type" ADD CONSTRAINT "order_type_delivery_fee_not_negative"
  CHECK ("default_delivery_fee" >= 0);

-- ── At most one default order type per business ──────────────────────────────
-- Same "unique when true" rule as the default stock location, and for the same reason: two
-- defaults make "what kind of order is this?" ambiguous, and the ambiguity surfaces as
-- intermittently wrong delivery fees rather than as an error.
CREATE UNIQUE INDEX "order_type_one_default_per_business"
  ON "order_type" ("business_id")
  WHERE "is_default";

