-- CreateEnum
CREATE TYPE "vehicle_type" AS ENUM ('ON_FOOT', 'BICYCLE', 'MOTORCYCLE', 'CAR', 'VAN', 'OTHER');

-- CreateEnum
CREATE TYPE "delivery_status" AS ENUM ('PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "delivery_event_type" AS ENUM ('CREATED', 'ASSIGNED', 'REASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'CANCELED', 'NOTE');

-- CreateEnum
CREATE TYPE "earning_type" AS ENUM ('DELIVERY', 'TIP', 'BONUS', 'ADJUSTMENT', 'DEDUCTION');

-- CreateEnum
CREATE TYPE "earning_status" AS ENUM ('PENDING', 'APPROVED', 'PAID');

-- CreateTable
CREATE TABLE "delivery_event" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "delivery_id" TEXT NOT NULL,
    "type" "delivery_event_type" NOT NULL,
    "from_status" "delivery_status",
    "to_status" "delivery_status",
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "note" TEXT,
    "actor_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "delivery_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver_earning" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "delivery_id" TEXT,
    "type" "earning_type" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "status" "earning_status" NOT NULL DEFAULT 'PENDING',
    "approved_by_id" TEXT,
    "approved_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "driver_earning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "user_id" TEXT,
    "code" VARCHAR(32) NOT NULL,
    "first_name" VARCHAR(120) NOT NULL,
    "last_name" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(32) NOT NULL,
    "email" VARCHAR(320),
    "vehicle_type" "vehicle_type" NOT NULL DEFAULT 'MOTORCYCLE',
    "vehicle_plate" VARCHAR(32),
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "current_latitude" DECIMAL(9,6),
    "current_longitude" DECIMAL(9,6),
    "last_seen_at" TIMESTAMP(3),
    "delivery_fee" DECIMAL(14,2),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_company" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "contact_name" VARCHAR(160),
    "email" VARCHAR(320),
    "phone" VARCHAR(32),
    "address_line" VARCHAR(200),
    "city" VARCHAR(120),
    "country" CHAR(2),
    "commission_rate" DECIMAL(5,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_driver" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "delivery_company_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_zone" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "code" VARCHAR(32),
    "description" TEXT,
    "color" VARCHAR(9),
    "center_latitude" DECIMAL(9,6),
    "center_longitude" DECIMAL(9,6),
    "radius_km" DECIMAL(6,2),
    "polygon" JSONB,
    "delivery_fee" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "min_order_amount" DECIMAL(14,2),
    "free_delivery_threshold" DECIMAL(14,2),
    "estimated_minutes" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_radius_rule" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "min_distance_km" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "max_distance_km" DECIMAL(6,2),
    "delivery_fee" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "estimated_minutes" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_radius_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "driver_id" TEXT,
    "delivery_company_id" TEXT,
    "zone_id" TEXT,
    "status" "delivery_status" NOT NULL DEFAULT 'PENDING',
    "address_line" VARCHAR(200) NOT NULL,
    "city" VARCHAR(120),
    "postal_code" VARCHAR(32),
    "phone" VARCHAR(32),
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "distance_km" DECIMAL(6,2),
    "fee" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "driver_fee" DECIMAL(14,2),
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "assigned_at" TIMESTAMP(3),
    "picked_up_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "failure_reason" VARCHAR(200),
    "proof_url" TEXT,
    "signature_url" TEXT,
    "recipient_name" VARCHAR(160),
    "notes" TEXT,
    "assigned_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "delivery_event_delivery_id_created_at_idx" ON "delivery_event"("delivery_id", "created_at");

-- CreateIndex
CREATE INDEX "delivery_event_business_id_created_at_idx" ON "delivery_event"("business_id", "created_at");

-- CreateIndex
CREATE INDEX "driver_earning_business_id_status_created_at_idx" ON "driver_earning"("business_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "driver_earning_driver_id_status_idx" ON "driver_earning"("driver_id", "status");

-- CreateIndex
CREATE INDEX "driver_earning_delivery_id_idx" ON "driver_earning"("delivery_id");

-- CreateIndex
CREATE INDEX "driver_business_id_is_active_is_available_idx" ON "driver"("business_id", "is_active", "is_available");

-- CreateIndex
CREATE INDEX "driver_user_id_idx" ON "driver"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "driver_business_id_code_key" ON "driver"("business_id", "code");

-- CreateIndex
CREATE INDEX "delivery_company_business_id_is_active_idx" ON "delivery_company"("business_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_company_business_id_name_key" ON "delivery_company"("business_id", "name");

-- CreateIndex
CREATE INDEX "company_driver_business_id_idx" ON "company_driver"("business_id");

-- CreateIndex
CREATE INDEX "company_driver_driver_id_idx" ON "company_driver"("driver_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_driver_delivery_company_id_driver_id_key" ON "company_driver"("delivery_company_id", "driver_id");

-- CreateIndex
CREATE INDEX "delivery_zone_business_id_is_active_sort_order_idx" ON "delivery_zone"("business_id", "is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_zone_business_id_name_key" ON "delivery_zone"("business_id", "name");

-- CreateIndex
CREATE INDEX "delivery_radius_rule_business_id_is_active_sort_order_idx" ON "delivery_radius_rule"("business_id", "is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_radius_rule_business_id_name_key" ON "delivery_radius_rule"("business_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_order_id_key" ON "delivery"("order_id");

-- CreateIndex
CREATE INDEX "delivery_business_id_status_created_at_idx" ON "delivery"("business_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "delivery_driver_id_status_idx" ON "delivery"("driver_id", "status");

-- CreateIndex
CREATE INDEX "delivery_delivery_company_id_idx" ON "delivery"("delivery_company_id");

-- AddForeignKey
ALTER TABLE "delivery_event" ADD CONSTRAINT "delivery_event_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_event" ADD CONSTRAINT "delivery_event_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "delivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_event" ADD CONSTRAINT "delivery_event_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_earning" ADD CONSTRAINT "driver_earning_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_earning" ADD CONSTRAINT "driver_earning_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_earning" ADD CONSTRAINT "driver_earning_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "delivery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_earning" ADD CONSTRAINT "driver_earning_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver" ADD CONSTRAINT "driver_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver" ADD CONSTRAINT "driver_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_company" ADD CONSTRAINT "delivery_company_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_driver" ADD CONSTRAINT "company_driver_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_driver" ADD CONSTRAINT "company_driver_delivery_company_id_fkey" FOREIGN KEY ("delivery_company_id") REFERENCES "delivery_company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_driver" ADD CONSTRAINT "company_driver_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_zone" ADD CONSTRAINT "delivery_zone_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_radius_rule" ADD CONSTRAINT "delivery_radius_rule_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery" ADD CONSTRAINT "delivery_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery" ADD CONSTRAINT "delivery_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "customer_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery" ADD CONSTRAINT "delivery_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery" ADD CONSTRAINT "delivery_delivery_company_id_fkey" FOREIGN KEY ("delivery_company_id") REFERENCES "delivery_company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery" ADD CONSTRAINT "delivery_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "delivery_zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery" ADD CONSTRAINT "delivery_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ═════════════════════════════════════════════════════════════════════════════
-- Constraints Prisma cannot express, for delivery.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── Fees and distances are not negative ──────────────────────────────────────
-- A negative fee would mean the business pays the customer to deliver to them, and a negative
-- distance is not a thing that happened. Both are easy to produce from a bad import.
ALTER TABLE "delivery_zone" ADD CONSTRAINT "delivery_zone_fee_not_negative"
  CHECK ("delivery_fee" >= 0);

ALTER TABLE "delivery_zone" ADD CONSTRAINT "delivery_zone_thresholds_not_negative"
  CHECK (
    ("min_order_amount" IS NULL OR "min_order_amount" >= 0)
    AND ("free_delivery_threshold" IS NULL OR "free_delivery_threshold" >= 0)
    AND ("radius_km" IS NULL OR "radius_km" >= 0)
  );

-- Free delivery below the minimum order value is a configuration nobody means: it would deliver a
-- 2 € order for nothing, which is the opposite of what a minimum is for.
ALTER TABLE "delivery_zone" ADD CONSTRAINT "delivery_zone_thresholds_coherent"
  CHECK (
    "min_order_amount" IS NULL
    OR "free_delivery_threshold" IS NULL
    OR "free_delivery_threshold" >= "min_order_amount"
  );

ALTER TABLE "delivery_radius_rule" ADD CONSTRAINT "delivery_radius_rule_band_ordered"
  CHECK ("max_distance_km" IS NULL OR "max_distance_km" > "min_distance_km");

ALTER TABLE "delivery_radius_rule" ADD CONSTRAINT "delivery_radius_rule_amounts_not_negative"
  CHECK ("min_distance_km" >= 0 AND "delivery_fee" >= 0);

ALTER TABLE "driver" ADD CONSTRAINT "driver_fee_not_negative"
  CHECK ("delivery_fee" IS NULL OR "delivery_fee" >= 0);

-- Coordinates must be coordinates: latitude stops at 90, longitude at 180. A transposed pair would
-- otherwise place a driver somewhere unreachable and every distance calculation would be nonsense.
ALTER TABLE "driver" ADD CONSTRAINT "driver_coordinates_are_coordinates"
  CHECK (
    ("current_latitude" IS NULL OR ("current_latitude" >= -90 AND "current_latitude" <= 90))
    AND ("current_longitude" IS NULL OR ("current_longitude" >= -180 AND "current_longitude" <= 180))
  );

ALTER TABLE "delivery" ADD CONSTRAINT "delivery_coordinates_are_coordinates"
  CHECK (
    ("latitude" IS NULL OR ("latitude" >= -90 AND "latitude" <= 90))
    AND ("longitude" IS NULL OR ("longitude" >= -180 AND "longitude" <= 180))
  );

ALTER TABLE "delivery" ADD CONSTRAINT "delivery_amounts_not_negative"
  CHECK (
    "fee" >= 0
    AND ("driver_fee" IS NULL OR "driver_fee" >= 0)
    AND ("distance_km" IS NULL OR "distance_km" >= 0)
  );

ALTER TABLE "delivery_event" ADD CONSTRAINT "delivery_event_coordinates_are_coordinates"
  CHECK (
    ("latitude" IS NULL OR ("latitude" >= -90 AND "latitude" <= 90))
    AND ("longitude" IS NULL OR ("longitude" >= -180 AND "longitude" <= 180))
  );

-- ── An earning is an amount, and an approval is complete ─────────────────────
-- A zero earning records nothing, and a zero row in a settlement is noise a driver's statement has
-- to explain.
ALTER TABLE "driver_earning" ADD CONSTRAINT "driver_earning_amount_not_zero"
  CHECK ("amount" <> 0);

ALTER TABLE "driver_earning" ADD CONSTRAINT "driver_earning_approval_is_all_or_nothing"
  CHECK (num_nonnulls("approved_by_id", "approved_at") IN (0, 2));

