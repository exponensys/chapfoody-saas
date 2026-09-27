-- CreateEnum
CREATE TYPE "affiliate_status" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "referral_kind" AS ENUM ('SIGNUP', 'ORDER', 'SUBSCRIPTION');

-- CreateEnum
CREATE TYPE "referral_status" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- CreateEnum
CREATE TYPE "commission_type" AS ENUM ('REFERRAL', 'RECURRING', 'BONUS', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "commission_status" AS ENUM ('PENDING', 'APPROVED', 'PAID', 'REVERSED');

-- CreateEnum
CREATE TYPE "payout_status" AS ENUM ('DRAFT', 'APPROVED', 'PAID', 'FAILED');

-- CreateEnum
CREATE TYPE "payout_method" AS ENUM ('BANK_TRANSFER', 'MOBILE_MONEY', 'PAYPAL', 'CASH');

-- CreateEnum
CREATE TYPE "referral_target" AS ENUM ('STOREFRONT', 'PRODUCT', 'CATEGORY', 'SIGNUP', 'CUSTOM');

-- CreateTable
CREATE TABLE "affiliate" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "user_id" TEXT,
    "code" VARCHAR(32) NOT NULL,
    "display_name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(320),
    "phone" VARCHAR(32),
    "website" VARCHAR(320),
    "socials" JSONB,
    "commission_rate" DECIMAL(5,2),
    "attribution_window_days" INTEGER NOT NULL DEFAULT 30,
    "status" "affiliate_status" NOT NULL DEFAULT 'PENDING',
    "payout_method" "payout_method",
    "payout_details" JSONB,
    "approved_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "affiliate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral_link" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "affiliate_id" TEXT NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "label" VARCHAR(160),
    "target_type" "referral_target" NOT NULL DEFAULT 'STOREFRONT',
    "target_id" TEXT,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "first_click_at" TIMESTAMP(3),
    "last_click_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referral_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "affiliate_id" TEXT NOT NULL,
    "referral_link_id" TEXT,
    "kind" "referral_kind" NOT NULL,
    "order_id" TEXT,
    "customer_ref" VARCHAR(200),
    "status" "referral_status" NOT NULL DEFAULT 'PENDING',
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "base_amount" DECIMAL(14,2),
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "rejection_reason" VARCHAR(200),
    "ip_address" INET,
    "user_agent" TEXT,
    "confirmed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commission" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "affiliate_id" TEXT NOT NULL,
    "referral_id" TEXT,
    "type" "commission_type" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "rate" DECIMAL(5,2),
    "status" "commission_status" NOT NULL DEFAULT 'PENDING',
    "approved_by_id" TEXT,
    "approved_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "payout_id" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payout" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "affiliate_id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "status" "payout_status" NOT NULL DEFAULT 'DRAFT',
    "total_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "method" "payout_method",
    "reference" VARCHAR(160),
    "failure_reason" VARCHAR(200),
    "approved_by_id" TEXT,
    "approved_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "created_by_id" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "affiliate_business_id_status_idx" ON "affiliate"("business_id", "status");

-- CreateIndex
CREATE INDEX "affiliate_user_id_idx" ON "affiliate"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_business_id_code_key" ON "affiliate"("business_id", "code");

-- CreateIndex
CREATE INDEX "referral_link_affiliate_id_is_active_idx" ON "referral_link"("affiliate_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "referral_link_business_id_code_key" ON "referral_link"("business_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "referral_order_id_key" ON "referral"("order_id");

-- CreateIndex
CREATE INDEX "referral_business_id_occurred_at_idx" ON "referral"("business_id", "occurred_at");

-- CreateIndex
CREATE INDEX "referral_affiliate_id_status_occurred_at_idx" ON "referral"("affiliate_id", "status", "occurred_at");

-- CreateIndex
CREATE INDEX "referral_referral_link_id_idx" ON "referral"("referral_link_id");

-- CreateIndex
CREATE INDEX "commission_business_id_status_created_at_idx" ON "commission"("business_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "commission_affiliate_id_status_idx" ON "commission"("affiliate_id", "status");

-- CreateIndex
CREATE INDEX "commission_referral_id_idx" ON "commission"("referral_id");

-- CreateIndex
CREATE INDEX "commission_payout_id_idx" ON "commission"("payout_id");

-- CreateIndex
CREATE INDEX "payout_business_id_status_period_start_idx" ON "payout"("business_id", "status", "period_start");

-- CreateIndex
CREATE UNIQUE INDEX "payout_affiliate_id_period_start_period_end_key" ON "payout"("affiliate_id", "period_start", "period_end");

-- AddForeignKey
ALTER TABLE "affiliate" ADD CONSTRAINT "affiliate_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate" ADD CONSTRAINT "affiliate_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_link" ADD CONSTRAINT "referral_link_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_link" ADD CONSTRAINT "referral_link_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral" ADD CONSTRAINT "referral_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral" ADD CONSTRAINT "referral_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral" ADD CONSTRAINT "referral_referral_link_id_fkey" FOREIGN KEY ("referral_link_id") REFERENCES "referral_link"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission" ADD CONSTRAINT "commission_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission" ADD CONSTRAINT "commission_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission" ADD CONSTRAINT "commission_referral_id_fkey" FOREIGN KEY ("referral_id") REFERENCES "referral"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission" ADD CONSTRAINT "commission_payout_id_fkey" FOREIGN KEY ("payout_id") REFERENCES "payout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission" ADD CONSTRAINT "commission_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout" ADD CONSTRAINT "payout_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout" ADD CONSTRAINT "payout_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout" ADD CONSTRAINT "payout_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout" ADD CONSTRAINT "payout_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ═════════════════════════════════════════════════════════════════════════════
-- Constraints Prisma cannot express, for the affiliate programme.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── Rates are percentages, windows are finite ────────────────────────────────
-- A commission rate above 100 % pays a partner more than the sale earned. An attribution window of
-- zero days credits nobody; one of a thousand days credits everybody forever.
ALTER TABLE "affiliate" ADD CONSTRAINT "affiliate_rate_is_a_percentage"
  CHECK ("commission_rate" IS NULL OR ("commission_rate" >= 0 AND "commission_rate" <= 100));

ALTER TABLE "affiliate" ADD CONSTRAINT "affiliate_attribution_window_sane"
  CHECK ("attribution_window_days" > 0 AND "attribution_window_days" <= 365);

ALTER TABLE "commission" ADD CONSTRAINT "commission_rate_is_a_percentage"
  CHECK ("rate" IS NULL OR ("rate" >= 0 AND "rate" <= 100));

-- ── Counts and amounts do not go negative ────────────────────────────────────
ALTER TABLE "referral_link" ADD CONSTRAINT "referral_link_clicks_not_negative"
  CHECK ("clicks" >= 0);

ALTER TABLE "referral" ADD CONSTRAINT "referral_base_not_negative"
  CHECK ("base_amount" IS NULL OR "base_amount" >= 0);

ALTER TABLE "payout" ADD CONSTRAINT "payout_total_not_negative"
  CHECK ("total_amount" >= 0);

ALTER TABLE "payout" ADD CONSTRAINT "payout_period_ordered"
  CHECK ("period_end" >= "period_start");

-- A payout of nothing is a data-entry artefact, not a payment.
ALTER TABLE "commission" ADD CONSTRAINT "commission_amount_not_zero"
  CHECK ("amount" <> 0);

-- ── A paid commission must point at the payment ──────────────────────────────
-- This is the rule that makes a settlement auditable, and it is expressible per row: a commission
-- cannot be PAID without a payout to attach it to and a date it was paid on. Without it, "has this
-- partner been paid?" has to be answered by reading two tables and trusting that nobody updated one
-- of them by hand.
ALTER TABLE "commission" ADD CONSTRAINT "commission_paid_implies_settled"
  CHECK ("status" <> 'PAID' OR ("payout_id" IS NOT NULL AND "paid_at" IS NOT NULL));

-- The same rule at the batch level: a payout cannot be PAID without a date, and cannot be APPROVED
-- without a name against it.
ALTER TABLE "payout" ADD CONSTRAINT "payout_status_implies_details"
  CHECK (
    ("status" <> 'PAID' OR "paid_at" IS NOT NULL)
    AND ("status" <> 'FAILED' OR "failure_reason" IS NOT NULL)
  );

ALTER TABLE "commission" ADD CONSTRAINT "commission_approval_is_all_or_nothing"
  CHECK (num_nonnulls("approved_by_id", "approved_at") IN (0, 2));

ALTER TABLE "payout" ADD CONSTRAINT "payout_approval_is_all_or_nothing"
  CHECK (num_nonnulls("approved_by_id", "approved_at") IN (0, 2));

-- ── A referral's currency must match the money it describes ──────────────────
-- Not checkable across tables, but this much is: a base amount with no currency is a figure nobody
-- can add up. The column has a default, so this only catches an explicit empty string.
ALTER TABLE "referral" ADD CONSTRAINT "referral_currency_present"
  CHECK (length("currency") = 3);

ALTER TABLE "commission" ADD CONSTRAINT "commission_currency_present"
  CHECK (length("currency") = 3);

