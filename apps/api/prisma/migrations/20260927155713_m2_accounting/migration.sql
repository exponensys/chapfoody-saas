-- CreateEnum
CREATE TYPE "account_type" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "journal_code" AS ENUM ('SALES', 'PURCHASES', 'CASH', 'BANK', 'PAYROLL', 'STOCK', 'VAT', 'GENERAL');

-- CreateEnum
CREATE TYPE "journal_entry_status" AS ENUM ('DRAFT', 'POSTED', 'REVERSED');

-- CreateEnum
CREATE TYPE "document_type" AS ENUM ('SALES_INVOICE', 'CREDIT_NOTE', 'PURCHASE_INVOICE', 'RECEIPT', 'DELIVERY_NOTE', 'OTHER');

-- CreateEnum
CREATE TYPE "document_status" AS ENUM ('DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'VOID');

-- CreateEnum
CREATE TYPE "export_format" AS ENUM ('CSV', 'EXCEL', 'PDF', 'FEC');

-- CreateEnum
CREATE TYPE "export_status" AS ENUM ('PENDING', 'GENERATED', 'FAILED');

-- CreateEnum
CREATE TYPE "snapshot_basis" AS ENUM ('PROVISIONAL', 'FINAL');

-- CreateTable
CREATE TABLE "accounting_document" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "type" "document_type" NOT NULL,
    "number" VARCHAR(64) NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3),
    "party_name" VARCHAR(200) NOT NULL,
    "party_email" VARCHAR(320),
    "subtotal" DECIMAL(14,2) NOT NULL,
    "tax_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(14,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "status" "document_status" NOT NULL DEFAULT 'DRAFT',
    "journal_entry_id" TEXT,
    "order_id" TEXT,
    "purchase_order_id" TEXT,
    "pdf_url" TEXT,
    "notes" TEXT,
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounting_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_line" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "quantity" DECIMAL(14,3) NOT NULL,
    "unit_price" DECIMAL(14,2) NOT NULL,
    "tax_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "line_total" DECIMAL(14,2) NOT NULL,
    "account_id" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "balance_sheet_snapshot" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "as_of_date" TIMESTAMP(3) NOT NULL,
    "basis" "snapshot_basis" NOT NULL DEFAULT 'PROVISIONAL',
    "total_assets" DECIMAL(14,2) NOT NULL,
    "total_liabilities" DECIMAL(14,2) NOT NULL,
    "total_equity" DECIMAL(14,2) NOT NULL,
    "revenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "expenses" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "net_result" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "note" TEXT,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "balance_sheet_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting_export" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "format" "export_format" NOT NULL DEFAULT 'CSV',
    "status" "export_status" NOT NULL DEFAULT 'PENDING',
    "file_url" TEXT,
    "row_count" INTEGER,
    "generated_at" TIMESTAMP(3),
    "error_message" TEXT,
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounting_export_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_plan" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "type" "account_type" NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_entry" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "number" VARCHAR(32) NOT NULL,
    "journal" "journal_code" NOT NULL,
    "entry_date" TIMESTAMP(3) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "status" "journal_entry_status" NOT NULL DEFAULT 'DRAFT',
    "total_debit" DECIMAL(14,2) NOT NULL,
    "total_credit" DECIMAL(14,2) NOT NULL,
    "reference_type" VARCHAR(48),
    "reference_id" TEXT,
    "posted_at" TIMESTAMP(3),
    "posted_by_id" TEXT,
    "reversal_of_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journal_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_line" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "journal_entry_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "label" VARCHAR(300) NOT NULL,
    "debit" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "credit" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journal_line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_journal_entry" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "journal_entry_id" TEXT NOT NULL,
    "posted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_journal_entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounting_document_journal_entry_id_key" ON "accounting_document"("journal_entry_id");

-- CreateIndex
CREATE INDEX "accounting_document_business_id_issue_date_idx" ON "accounting_document"("business_id", "issue_date");

-- CreateIndex
CREATE INDEX "accounting_document_business_id_status_due_date_idx" ON "accounting_document"("business_id", "status", "due_date");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_document_business_id_type_number_key" ON "accounting_document"("business_id", "type", "number");

-- CreateIndex
CREATE INDEX "document_line_document_id_sort_order_idx" ON "document_line"("document_id", "sort_order");

-- CreateIndex
CREATE INDEX "document_line_business_id_idx" ON "document_line"("business_id");

-- CreateIndex
CREATE INDEX "balance_sheet_snapshot_business_id_as_of_date_idx" ON "balance_sheet_snapshot"("business_id", "as_of_date");

-- CreateIndex
CREATE UNIQUE INDEX "balance_sheet_snapshot_business_id_as_of_date_basis_key" ON "balance_sheet_snapshot"("business_id", "as_of_date", "basis");

-- CreateIndex
CREATE INDEX "accounting_export_business_id_period_start_idx" ON "accounting_export"("business_id", "period_start");

-- CreateIndex
CREATE INDEX "accounting_export_business_id_status_idx" ON "accounting_export"("business_id", "status");

-- CreateIndex
CREATE INDEX "account_plan_business_id_type_sort_order_idx" ON "account_plan"("business_id", "type", "sort_order");

-- CreateIndex
CREATE INDEX "account_plan_parent_id_idx" ON "account_plan"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_plan_business_id_code_key" ON "account_plan"("business_id", "code");

-- CreateIndex
CREATE INDEX "journal_entry_business_id_entry_date_idx" ON "journal_entry"("business_id", "entry_date");

-- CreateIndex
CREATE INDEX "journal_entry_business_id_journal_entry_date_idx" ON "journal_entry"("business_id", "journal", "entry_date");

-- CreateIndex
CREATE INDEX "journal_entry_business_id_status_entry_date_idx" ON "journal_entry"("business_id", "status", "entry_date");

-- CreateIndex
CREATE INDEX "journal_entry_reference_type_reference_id_idx" ON "journal_entry"("reference_type", "reference_id");

-- CreateIndex
CREATE UNIQUE INDEX "journal_entry_business_id_number_key" ON "journal_entry"("business_id", "number");

-- CreateIndex
CREATE INDEX "journal_line_journal_entry_id_position_idx" ON "journal_line"("journal_entry_id", "position");

-- CreateIndex
CREATE INDEX "journal_line_account_id_created_at_idx" ON "journal_line"("account_id", "created_at");

-- CreateIndex
CREATE INDEX "journal_line_business_id_idx" ON "journal_line"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "sales_journal_entry_order_id_key" ON "sales_journal_entry"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "sales_journal_entry_journal_entry_id_key" ON "sales_journal_entry"("journal_entry_id");

-- CreateIndex
CREATE INDEX "sales_journal_entry_business_id_posted_at_idx" ON "sales_journal_entry"("business_id", "posted_at");

-- AddForeignKey
ALTER TABLE "accounting_document" ADD CONSTRAINT "accounting_document_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting_document" ADD CONSTRAINT "accounting_document_journal_entry_id_fkey" FOREIGN KEY ("journal_entry_id") REFERENCES "journal_entry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting_document" ADD CONSTRAINT "accounting_document_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_line" ADD CONSTRAINT "document_line_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_line" ADD CONSTRAINT "document_line_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "accounting_document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_line" ADD CONSTRAINT "document_line_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account_plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balance_sheet_snapshot" ADD CONSTRAINT "balance_sheet_snapshot_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting_export" ADD CONSTRAINT "accounting_export_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting_export" ADD CONSTRAINT "accounting_export_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_plan" ADD CONSTRAINT "account_plan_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_plan" ADD CONSTRAINT "account_plan_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "account_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entry" ADD CONSTRAINT "journal_entry_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entry" ADD CONSTRAINT "journal_entry_posted_by_id_fkey" FOREIGN KEY ("posted_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entry" ADD CONSTRAINT "journal_entry_reversal_of_id_fkey" FOREIGN KEY ("reversal_of_id") REFERENCES "journal_entry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_line" ADD CONSTRAINT "journal_line_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_line" ADD CONSTRAINT "journal_line_journal_entry_id_fkey" FOREIGN KEY ("journal_entry_id") REFERENCES "journal_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_line" ADD CONSTRAINT "journal_line_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_journal_entry" ADD CONSTRAINT "sales_journal_entry_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_journal_entry" ADD CONSTRAINT "sales_journal_entry_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "customer_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_journal_entry" ADD CONSTRAINT "sales_journal_entry_journal_entry_id_fkey" FOREIGN KEY ("journal_entry_id") REFERENCES "journal_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ═════════════════════════════════════════════════════════════════════════════
-- Constraints and the double-entry guarantee.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── An entry balances (the cheap, always-on half) ────────────────────────────
ALTER TABLE "journal_entry" ADD CONSTRAINT "journal_entry_balances"
  CHECK ("total_debit" = "total_credit");

ALTER TABLE "journal_entry" ADD CONSTRAINT "journal_entry_totals_not_negative"
  CHECK ("total_debit" >= 0 AND "total_credit" >= 0);

-- ── A line is on exactly one side ────────────────────────────────────────────
-- A line with both sides filled would double-count; a line with neither records nothing. Both are
-- classes of error that produce a ledger that still balances, and therefore go unnoticed.
ALTER TABLE "journal_line" ADD CONSTRAINT "journal_line_one_side_only"
  CHECK (("debit" > 0 AND "credit" = 0) OR ("credit" > 0 AND "debit" = 0));

ALTER TABLE "journal_line" ADD CONSTRAINT "journal_line_amounts_not_negative"
  CHECK ("debit" >= 0 AND "credit" >= 0);

-- ── Documents and statements reconcile ───────────────────────────────────────
ALTER TABLE "accounting_document" ADD CONSTRAINT "accounting_document_total_reconciles"
  CHECK (round("subtotal" + "tax_amount", 2) = "total");

-- Holds for a credit note too, where every figure is negative: the arithmetic is the same.
ALTER TABLE "document_line" ADD CONSTRAINT "document_line_total_reconciles"
  CHECK (round("quantity" * "unit_price" + "tax_amount", 2) = "line_total");

-- The balance sheet equation. If this can be violated, the balance sheet is a decoration.
ALTER TABLE "balance_sheet_snapshot" ADD CONSTRAINT "balance_sheet_balances"
  CHECK (round("total_liabilities" + "total_equity", 2) = "total_assets");

ALTER TABLE "balance_sheet_snapshot" ADD CONSTRAINT "net_result_reconciles"
  CHECK (round("revenue" - "expenses", 2) = "net_result");

ALTER TABLE "accounting_export" ADD CONSTRAINT "accounting_export_period_ordered"
  CHECK ("period_end" >= "period_start");

-- ── The lines must add up to the entry, and the entry must balance ───────────
-- A CHECK cannot see other rows, so this is a constraint trigger. It is DEFERRABLE INITIALLY
-- DEFERRED, which is the detail that makes it usable: within a transaction a caller may insert the
-- debit line and the credit line in any order, and only the committed state is verified. Without
-- DEFERRABLE, no insert order would work and the constraint would be unusable in practice.
--
-- It fires on both tables. On `journal_line` because adding or removing a line changes the sum; on
-- `journal_entry` because someone could otherwise edit the stored totals without touching a line
-- and escape verification entirely.
CREATE OR REPLACE FUNCTION cf_check_journal_balance() RETURNS trigger
  LANGUAGE plpgsql
  AS $$
DECLARE
  target_id text;
  entry     record;
  sums      record;
BEGIN
  -- OLD is unassigned on INSERT and NEW on DELETE, so the branch is by operation first: reading
  -- the wrong one raises rather than returning null.
  IF TG_OP = 'DELETE' THEN
    target_id := CASE WHEN TG_TABLE_NAME = 'journal_line' THEN OLD.journal_entry_id ELSE OLD.id END;
  ELSE
    target_id := CASE WHEN TG_TABLE_NAME = 'journal_line' THEN NEW.journal_entry_id ELSE NEW.id END;
  END IF;

  SELECT id, total_debit, total_credit INTO entry FROM journal_entry WHERE id = target_id;

  -- Not found: the entry itself was deleted, and its lines were cascaded away with it. There is
  -- nothing left to be inconsistent with.
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  SELECT COALESCE(sum(debit), 0) AS debit, COALESCE(sum(credit), 0) AS credit
    INTO sums
    FROM journal_line
   WHERE journal_entry_id = target_id;

  IF sums.debit <> sums.credit THEN
    RAISE EXCEPTION 'Journal entry % does not balance: debit % <> credit %',
      entry.id, sums.debit, sums.credit
      USING ERRCODE = 'check_violation';
  END IF;

  IF sums.debit <> entry.total_debit OR sums.credit <> entry.total_credit THEN
    RAISE EXCEPTION 'Journal entry % stores totals (%, %) that disagree with its lines (%, %)',
      entry.id, entry.total_debit, entry.total_credit, sums.debit, sums.credit
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NULL;
END
$$;

CREATE CONSTRAINT TRIGGER journal_line_balances
  AFTER INSERT OR UPDATE OR DELETE ON journal_line
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION cf_check_journal_balance();

CREATE CONSTRAINT TRIGGER journal_entry_totals_verified
  AFTER INSERT OR UPDATE ON journal_entry
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION cf_check_journal_balance();

-- Not something the application role should be able to call or replace.
REVOKE ALL ON FUNCTION cf_check_journal_balance() FROM PUBLIC;

