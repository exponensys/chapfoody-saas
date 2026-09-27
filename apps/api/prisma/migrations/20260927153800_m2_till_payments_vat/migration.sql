-- AlterTable
ALTER TABLE "customer_order" ADD COLUMN     "pos_session_id" TEXT;

-- CreateTable
CREATE TABLE "vat_rate" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "rate" DECIMAL(5,2) NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vat_rate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vat_declaration" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "status" "vat_declaration_status" NOT NULL DEFAULT 'DRAFT',
    "collected_tax" DECIMAL(14,2) NOT NULL,
    "deductible_tax" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "net_tax_due" DECIMAL(14,2) NOT NULL,
    "taxable_turnover" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "filed_at" TIMESTAMP(3),
    "reference" VARCHAR(120),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vat_declaration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_session" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "opened_by_id" TEXT NOT NULL,
    "closed_by_id" TEXT,
    "opened_at" TIMESTAMP(3) NOT NULL,
    "closed_at" TIMESTAMP(3),
    "opening_float" DECIMAL(14,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "status" "pos_session_status" NOT NULL DEFAULT 'OPEN',
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pos_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cash_movement" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "pos_session_id" TEXT NOT NULL,
    "reason" "cash_movement_reason" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "note" TEXT,
    "actor_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cash_movement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cash_closure" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "pos_session_id" TEXT NOT NULL,
    "closed_by_id" TEXT NOT NULL,
    "counted_at" TIMESTAMP(3) NOT NULL,
    "order_count" INTEGER NOT NULL DEFAULT 0,
    "sales_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tax_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "cash_movements_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "expected_cash" DECIMAL(14,2) NOT NULL,
    "counted_cash" DECIMAL(14,2) NOT NULL,
    "difference" DECIMAL(14,2) NOT NULL,
    "cash_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "card_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "mobile_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "other_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tender_breakdown" JSONB,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cash_closure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transaction" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "pos_session_id" TEXT,
    "method" "tender_method" NOT NULL,
    "status" "tender_status" NOT NULL DEFAULT 'CAPTURED',
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "change_given" DECIMAL(14,2),
    "external_reference" VARCHAR(160),
    "provider" VARCHAR(64),
    "captured_at" TIMESTAMP(3),
    "failure_reason" VARCHAR(200),
    "actor_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refund" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "payment_transaction_id" TEXT,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "method" "tender_method",
    "reason" VARCHAR(200),
    "refunded_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refund_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vat_rate_business_id_is_active_sort_order_idx" ON "vat_rate"("business_id", "is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "vat_rate_business_id_rate_key" ON "vat_rate"("business_id", "rate");

-- CreateIndex
CREATE INDEX "vat_declaration_business_id_status_period_start_idx" ON "vat_declaration"("business_id", "status", "period_start");

-- CreateIndex
CREATE UNIQUE INDEX "vat_declaration_business_id_period_start_period_end_key" ON "vat_declaration"("business_id", "period_start", "period_end");

-- CreateIndex
CREATE INDEX "pos_session_business_id_status_opened_at_idx" ON "pos_session"("business_id", "status", "opened_at");

-- CreateIndex
CREATE INDEX "pos_session_location_id_idx" ON "pos_session"("location_id");

-- CreateIndex
CREATE INDEX "cash_movement_pos_session_id_created_at_idx" ON "cash_movement"("pos_session_id", "created_at");

-- CreateIndex
CREATE INDEX "cash_movement_business_id_created_at_idx" ON "cash_movement"("business_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "cash_closure_pos_session_id_key" ON "cash_closure"("pos_session_id");

-- CreateIndex
CREATE INDEX "cash_closure_business_id_counted_at_idx" ON "cash_closure"("business_id", "counted_at");

-- CreateIndex
CREATE INDEX "payment_transaction_order_id_idx" ON "payment_transaction"("order_id");

-- CreateIndex
CREATE INDEX "payment_transaction_business_id_created_at_idx" ON "payment_transaction"("business_id", "created_at");

-- CreateIndex
CREATE INDEX "payment_transaction_pos_session_id_idx" ON "payment_transaction"("pos_session_id");

-- CreateIndex
CREATE INDEX "payment_transaction_external_reference_idx" ON "payment_transaction"("external_reference");

-- CreateIndex
CREATE INDEX "refund_order_id_idx" ON "refund"("order_id");

-- CreateIndex
CREATE INDEX "refund_business_id_created_at_idx" ON "refund"("business_id", "created_at");

-- AddForeignKey
ALTER TABLE "customer_order" ADD CONSTRAINT "customer_order_pos_session_id_fkey" FOREIGN KEY ("pos_session_id") REFERENCES "pos_session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vat_rate" ADD CONSTRAINT "vat_rate_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vat_declaration" ADD CONSTRAINT "vat_declaration_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_session" ADD CONSTRAINT "pos_session_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_session" ADD CONSTRAINT "pos_session_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "stock_location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_session" ADD CONSTRAINT "pos_session_opened_by_id_fkey" FOREIGN KEY ("opened_by_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_session" ADD CONSTRAINT "pos_session_closed_by_id_fkey" FOREIGN KEY ("closed_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_movement" ADD CONSTRAINT "cash_movement_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_movement" ADD CONSTRAINT "cash_movement_pos_session_id_fkey" FOREIGN KEY ("pos_session_id") REFERENCES "pos_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_movement" ADD CONSTRAINT "cash_movement_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_closure" ADD CONSTRAINT "cash_closure_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_closure" ADD CONSTRAINT "cash_closure_pos_session_id_fkey" FOREIGN KEY ("pos_session_id") REFERENCES "pos_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_closure" ADD CONSTRAINT "cash_closure_closed_by_id_fkey" FOREIGN KEY ("closed_by_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transaction" ADD CONSTRAINT "payment_transaction_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transaction" ADD CONSTRAINT "payment_transaction_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "customer_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transaction" ADD CONSTRAINT "payment_transaction_pos_session_id_fkey" FOREIGN KEY ("pos_session_id") REFERENCES "pos_session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transaction" ADD CONSTRAINT "payment_transaction_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund" ADD CONSTRAINT "refund_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund" ADD CONSTRAINT "refund_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "customer_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund" ADD CONSTRAINT "refund_payment_transaction_id_fkey" FOREIGN KEY ("payment_transaction_id") REFERENCES "payment_transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund" ADD CONSTRAINT "refund_refunded_by_id_fkey" FOREIGN KEY ("refunded_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ═════════════════════════════════════════════════════════════════════════════
-- Constraints Prisma cannot express, for the till, payments and tax.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── The drawer must reconcile ────────────────────────────────────────────────
-- The same idea as an order's total: the number that will be argued about must be asserted by
-- the database, not computed by two different pieces of code that disagree by a cent.
ALTER TABLE "cash_closure" ADD CONSTRAINT "cash_closure_difference_reconciles"
  CHECK ("difference" = "counted_cash" - "expected_cash");

ALTER TABLE "cash_closure" ADD CONSTRAINT "cash_closure_amounts_not_negative"
  CHECK (
    "sales_total" >= 0 AND "tax_total" >= 0
    AND "cash_total" >= 0 AND "card_total" >= 0
    AND "mobile_total" >= 0 AND "other_total" >= 0
    AND "counted_cash" >= 0
  );

-- ── A VAT return must reconcile too ──────────────────────────────────────────
-- A declaration is a legal statement. collected − deductible = due is the one piece of
-- arithmetic in it that a tax office will check first.
ALTER TABLE "vat_declaration" ADD CONSTRAINT "vat_declaration_net_reconciles"
  CHECK ("net_tax_due" = "collected_tax" - "deductible_tax");

ALTER TABLE "vat_declaration" ADD CONSTRAINT "vat_declaration_period_ordered"
  CHECK ("period_end" >= "period_start");

ALTER TABLE "vat_declaration" ADD CONSTRAINT "vat_declaration_amounts_not_negative"
  CHECK ("collected_tax" >= 0 AND "deductible_tax" >= 0 AND "taxable_turnover" >= 0);

-- A VAT rate is a percentage: 100 would mean the tax exceeds the price, and a negative rate
-- would make the state pay the business on every sale.
ALTER TABLE "vat_rate" ADD CONSTRAINT "vat_rate_is_a_percentage"
  CHECK ("rate" >= 0 AND "rate" < 100);

-- ── Tenders ──────────────────────────────────────────────────────────────────
-- Change cannot exceed what was handed over: accepting that would mean the business receives
-- less than the goods were sold for, while the books say the sale completed.
ALTER TABLE "payment_transaction" ADD CONSTRAINT "payment_transaction_change_not_excessive"
  CHECK ("change_given" IS NULL OR ("change_given" >= 0 AND "change_given" <= "amount"));

ALTER TABLE "payment_transaction" ADD CONSTRAINT "payment_transaction_amount_positive"
  CHECK ("amount" > 0);

-- A refund of nothing is a data-entry artefact, and a negative refund is a sale wearing a
-- disguise.
ALTER TABLE "refund" ADD CONSTRAINT "refund_amount_positive"
  CHECK ("amount" > 0);

-- A zero-value cash movement records nothing; a cash report that has to skip zeroes is a report
-- written around its own data.
ALTER TABLE "cash_movement" ADD CONSTRAINT "cash_movement_amount_not_zero"
  CHECK ("amount" <> 0);

ALTER TABLE "pos_session" ADD CONSTRAINT "pos_session_opening_float_not_negative"
  CHECK ("opening_float" >= 0);

-- ── One open session per location ────────────────────────────────────────────
-- Two tills open on the same drawer is not a state the business can be in, and the failure it
-- would cause is not an error but a permanently ambiguous cash figure. Same "unique when true"
-- technique as the default stock location and the default order type.
CREATE UNIQUE INDEX "pos_session_one_open_per_location"
  ON "pos_session" ("location_id")
  WHERE "status" = 'OPEN';

