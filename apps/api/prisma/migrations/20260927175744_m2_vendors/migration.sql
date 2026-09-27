-- CreateEnum
CREATE TYPE "commission_scope" AS ENUM ('ORDER', 'PRODUCT', 'CATEGORY');

-- CreateTable
CREATE TABLE "vendor" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "user_id" TEXT,
    "code" VARCHAR(32) NOT NULL,
    "first_name" VARCHAR(120) NOT NULL,
    "last_name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(320),
    "phone" VARCHAR(32),
    "commission_rate" DECIMAL(5,2),
    "is_internal" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_commission_rule" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "vendor_id" TEXT,
    "name" VARCHAR(160) NOT NULL,
    "scope" "commission_scope" NOT NULL DEFAULT 'ORDER',
    "rate" DECIMAL(5,2),
    "fixed_amount" DECIMAL(14,2),
    "min_revenue" DECIMAL(14,2),
    "max_revenue" DECIMAL(14,2),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_commission_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_assignment" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "commission_base" DECIMAL(14,2) NOT NULL,
    "commission_rate" DECIMAL(5,2),
    "commission_amount" DECIMAL(14,2) NOT NULL,
    "commission_rule_id" TEXT,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "vendor_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_target" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "target_amount" DECIMAL(14,2) NOT NULL,
    "achieved_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "bonus_amount" DECIMAL(14,2),
    "bonus_rate" DECIMAL(5,2),
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_target_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vendor_business_id_is_active_idx" ON "vendor"("business_id", "is_active");

-- CreateIndex
CREATE INDEX "vendor_user_id_idx" ON "vendor"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_business_id_code_key" ON "vendor"("business_id", "code");

-- CreateIndex
CREATE INDEX "vendor_commission_rule_business_id_is_active_priority_idx" ON "vendor_commission_rule"("business_id", "is_active", "priority");

-- CreateIndex
CREATE INDEX "vendor_commission_rule_vendor_id_idx" ON "vendor_commission_rule"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_assignment_order_id_key" ON "vendor_assignment"("order_id");

-- CreateIndex
CREATE INDEX "vendor_assignment_business_id_assigned_at_idx" ON "vendor_assignment"("business_id", "assigned_at");

-- CreateIndex
CREATE INDEX "vendor_assignment_vendor_id_assigned_at_idx" ON "vendor_assignment"("vendor_id", "assigned_at");

-- CreateIndex
CREATE INDEX "vendor_target_business_id_period_start_idx" ON "vendor_target"("business_id", "period_start");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_target_vendor_id_period_start_period_end_key" ON "vendor_target"("vendor_id", "period_start", "period_end");

-- AddForeignKey
ALTER TABLE "vendor" ADD CONSTRAINT "vendor_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor" ADD CONSTRAINT "vendor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor" ADD CONSTRAINT "vendor_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_commission_rule" ADD CONSTRAINT "vendor_commission_rule_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_commission_rule" ADD CONSTRAINT "vendor_commission_rule_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_assignment" ADD CONSTRAINT "vendor_assignment_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_assignment" ADD CONSTRAINT "vendor_assignment_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_assignment" ADD CONSTRAINT "vendor_assignment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "customer_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_assignment" ADD CONSTRAINT "vendor_assignment_commission_rule_id_fkey" FOREIGN KEY ("commission_rule_id") REFERENCES "vendor_commission_rule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_target" ADD CONSTRAINT "vendor_target_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_target" ADD CONSTRAINT "vendor_target_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ═════════════════════════════════════════════════════════════════════════════
-- Constraints Prisma cannot express, for vendors and commissions.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── A commission rule states ONE basis ───────────────────────────────────────
-- Either a percentage or a fixed amount, never both and never neither. A rule with both would leave
-- the actual commission to whoever read it last, and a rule with neither would silently pay zero —
-- which is worse, because a vendor being underpaid looks like a payroll bug rather than a config one.
ALTER TABLE "vendor_commission_rule" ADD CONSTRAINT "vendor_commission_rule_one_basis"
  CHECK (num_nonnulls("rate", "fixed_amount") = 1);

-- A percentage of 120 would pay out more than the sale earned.
ALTER TABLE "vendor_commission_rule" ADD CONSTRAINT "vendor_commission_rule_rate_is_a_percentage"
  CHECK ("rate" IS NULL OR ("rate" >= 0 AND "rate" <= 100));

-- A tier whose upper bound sits below its lower bound matches no revenue at all, and would look
-- like a rule that simply "does not apply" rather than a typo.
ALTER TABLE "vendor_commission_rule" ADD CONSTRAINT "vendor_commission_rule_revenue_bounds_ordered"
  CHECK ("min_revenue" IS NULL OR "max_revenue" IS NULL OR "max_revenue" >= "min_revenue");

ALTER TABLE "vendor_commission_rule" ADD CONSTRAINT "vendor_commission_rule_amounts_not_negative"
  CHECK (
    ("fixed_amount" IS NULL OR "fixed_amount" >= 0)
    AND ("min_revenue" IS NULL OR "min_revenue" >= 0)
    AND ("max_revenue" IS NULL OR "max_revenue" >= 0)
  );

-- ── The vendor's own rate, and their period ──────────────────────────────────
ALTER TABLE "vendor" ADD CONSTRAINT "vendor_commission_rate_is_a_percentage"
  CHECK ("commission_rate" IS NULL OR ("commission_rate" >= 0 AND "commission_rate" <= 100));

ALTER TABLE "vendor" ADD CONSTRAINT "vendor_period_ordered"
  CHECK ("ended_at" IS NULL OR "started_at" IS NULL OR "ended_at" >= "started_at");

-- ── What a vendor is credited with ───────────────────────────────────────────
-- A negative base or commission would mean the business owes the vendor nothing and the vendor owes
-- the business — a state a commission run should never be able to reach by arithmetic accident.
ALTER TABLE "vendor_assignment" ADD CONSTRAINT "vendor_assignment_amounts_not_negative"
  CHECK ("commission_base" >= 0 AND "commission_amount" >= 0);

ALTER TABLE "vendor_assignment" ADD CONSTRAINT "vendor_assignment_rate_is_a_percentage"
  CHECK ("commission_rate" IS NULL OR ("commission_rate" >= 0 AND "commission_rate" <= 100));

-- ── Targets ──────────────────────────────────────────────────────────────────
ALTER TABLE "vendor_target" ADD CONSTRAINT "vendor_target_period_ordered"
  CHECK ("period_end" >= "period_start");

ALTER TABLE "vendor_target" ADD CONSTRAINT "vendor_target_amounts_not_negative"
  CHECK (
    "target_amount" >= 0
    AND "achieved_amount" >= 0
    AND ("bonus_amount" IS NULL OR "bonus_amount" >= 0)
    AND ("bonus_rate" IS NULL OR ("bonus_rate" >= 0 AND "bonus_rate" <= 100))
  );

