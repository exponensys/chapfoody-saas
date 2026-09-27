-- CreateEnum
CREATE TYPE "employee_status" AS ENUM ('ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "contract_type" AS ENUM ('PERMANENT', 'FIXED_TERM', 'TEMPORARY', 'INTERNSHIP', 'APPRENTICESHIP', 'FREELANCE');

-- CreateEnum
CREATE TYPE "shift_status" AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'ABSENT', 'CANCELED');

-- CreateEnum
CREATE TYPE "time_entry_source" AS ENUM ('MANUAL', 'POS', 'MOBILE', 'IMPORT');

-- CreateEnum
CREATE TYPE "payroll_status" AS ENUM ('DRAFT', 'CALCULATED', 'APPROVED', 'PAID', 'CANCELED');

-- CreateTable
CREATE TABLE "employee" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "user_id" TEXT,
    "employee_number" VARCHAR(32) NOT NULL,
    "first_name" VARCHAR(120) NOT NULL,
    "last_name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(320),
    "phone" VARCHAR(32),
    "birth_date" DATE,
    "address_line" VARCHAR(200),
    "city" VARCHAR(120),
    "postal_code" VARCHAR(32),
    "country" CHAR(2),
    "job_title" VARCHAR(160),
    "status" "employee_status" NOT NULL DEFAULT 'ACTIVE',
    "hired_at" DATE NOT NULL,
    "ended_at" DATE,
    "notes" TEXT,
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "type" "contract_type" NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "job_title" VARCHAR(160),
    "weekly_hours" DECIMAL(5,2),
    "monthly_salary" DECIMAL(14,2),
    "hourly_rate" DECIMAL(14,2),
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "signed_at" TIMESTAMP(3),
    "document_url" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shift" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "location_id" TEXT,
    "employee_id" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "break_minutes" INTEGER NOT NULL DEFAULT 0,
    "role" "role_key",
    "status" "shift_status" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_entry" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "shift_id" TEXT,
    "clock_in_at" TIMESTAMP(3) NOT NULL,
    "clock_out_at" TIMESTAMP(3),
    "break_minutes" INTEGER NOT NULL DEFAULT 0,
    "worked_minutes" INTEGER,
    "source" "time_entry_source" NOT NULL DEFAULT 'MANUAL',
    "note" TEXT,
    "approved_by_id" TEXT,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_run" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "status" "payroll_status" NOT NULL DEFAULT 'DRAFT',
    "gross_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "bonus_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "deduction_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "employee_contribution_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "employer_contribution_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "net_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "journal_entry_id" TEXT,
    "approved_by_id" TEXT,
    "approved_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "created_by_id" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payslip" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "payroll_run_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "contract_id" TEXT,
    "hours" DECIMAL(7,2),
    "gross_amount" DECIMAL(14,2) NOT NULL,
    "employee_contribution_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "employer_contribution_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "net_amount" DECIMAL(14,2) NOT NULL,
    "bonus_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "deduction_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "pdf_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payslip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "employee_business_id_status_idx" ON "employee"("business_id", "status");

-- CreateIndex
CREATE INDEX "employee_user_id_idx" ON "employee"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "employee_business_id_employee_number_key" ON "employee"("business_id", "employee_number");

-- CreateIndex
CREATE INDEX "contract_employee_id_start_date_idx" ON "contract"("employee_id", "start_date");

-- CreateIndex
CREATE INDEX "contract_business_id_type_idx" ON "contract"("business_id", "type");

-- CreateIndex
CREATE INDEX "shift_business_id_starts_at_idx" ON "shift"("business_id", "starts_at");

-- CreateIndex
CREATE INDEX "shift_employee_id_starts_at_idx" ON "shift"("employee_id", "starts_at");

-- CreateIndex
CREATE INDEX "shift_location_id_starts_at_idx" ON "shift"("location_id", "starts_at");

-- CreateIndex
CREATE INDEX "time_entry_business_id_clock_in_at_idx" ON "time_entry"("business_id", "clock_in_at");

-- CreateIndex
CREATE INDEX "time_entry_employee_id_clock_in_at_idx" ON "time_entry"("employee_id", "clock_in_at");

-- CreateIndex
CREATE INDEX "time_entry_shift_id_idx" ON "time_entry"("shift_id");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_run_journal_entry_id_key" ON "payroll_run"("journal_entry_id");

-- CreateIndex
CREATE INDEX "payroll_run_business_id_status_period_start_idx" ON "payroll_run"("business_id", "status", "period_start");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_run_business_id_period_start_period_end_key" ON "payroll_run"("business_id", "period_start", "period_end");

-- CreateIndex
CREATE INDEX "payslip_business_id_idx" ON "payslip"("business_id");

-- CreateIndex
CREATE INDEX "payslip_employee_id_idx" ON "payslip"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "payslip_payroll_run_id_employee_id_key" ON "payslip"("payroll_run_id", "employee_id");

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift" ADD CONSTRAINT "shift_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift" ADD CONSTRAINT "shift_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "stock_location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift" ADD CONSTRAINT "shift_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift" ADD CONSTRAINT "shift_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "shift"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_run" ADD CONSTRAINT "payroll_run_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_run" ADD CONSTRAINT "payroll_run_journal_entry_id_fkey" FOREIGN KEY ("journal_entry_id") REFERENCES "journal_entry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_run" ADD CONSTRAINT "payroll_run_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_run" ADD CONSTRAINT "payroll_run_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslip" ADD CONSTRAINT "payslip_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslip" ADD CONSTRAINT "payslip_payroll_run_id_fkey" FOREIGN KEY ("payroll_run_id") REFERENCES "payroll_run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslip" ADD CONSTRAINT "payslip_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslip" ADD CONSTRAINT "payslip_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ═════════════════════════════════════════════════════════════════════════════
-- Constraints Prisma cannot express, for HR and payroll.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── An employee's contracts may not overlap ──────────────────────────────────
-- This is the rule a CHECK cannot state, because it is about two ROWS rather than one: no two of an
-- employee's contracts may cover the same day. PostgreSQL has exactly the right tool — an EXCLUDE
-- constraint over a date range — and it needs btree_gist so that gist can index the equality on
-- employee_id alongside the range overlap.
--
-- The range is [start, end) and an open-ended contract runs to infinity, so a permanent contract and
-- a later fixed-term amendment conflict rather than quietly coexisting. Without this, an employee
-- could hold two contracts at once and payroll would pay them twice with nothing to indicate why.
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "contract" ADD CONSTRAINT "contract_no_overlapping_periods"
  EXCLUDE USING gist (
    "employee_id" WITH =,
    daterange("start_date", COALESCE("end_date", 'infinity'::date), '[)') WITH &&
  );

-- ── A contract promises at least one form of pay ─────────────────────────────
-- A contract with neither a salary nor an hourly rate is not an employment contract, it is a
-- misunderstanding — and it would be priced at zero by every payroll run without complaint.
ALTER TABLE "contract" ADD CONSTRAINT "contract_has_a_basis_for_pay"
  CHECK (num_nonnulls("monthly_salary", "hourly_rate") >= 1);

ALTER TABLE "contract" ADD CONSTRAINT "contract_period_ordered"
  CHECK ("end_date" IS NULL OR "end_date" >= "start_date");

ALTER TABLE "contract" ADD CONSTRAINT "contract_amounts_not_negative"
  CHECK (
    ("monthly_salary" IS NULL OR "monthly_salary" >= 0)
    AND ("hourly_rate" IS NULL OR "hourly_rate" >= 0)
    AND ("weekly_hours" IS NULL OR "weekly_hours" >= 0)
  );

-- ── Employment dates and rosters ─────────────────────────────────────────────
ALTER TABLE "employee" ADD CONSTRAINT "employee_period_ordered"
  CHECK ("ended_at" IS NULL OR "ended_at" >= "hired_at");

ALTER TABLE "shift" ADD CONSTRAINT "shift_period_ordered"
  CHECK ("ends_at" > "starts_at");

ALTER TABLE "shift" ADD CONSTRAINT "shift_break_not_negative"
  CHECK ("break_minutes" >= 0);

-- ── A time entry describes a real interval ───────────────────────────────────
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_clock_out_after_clock_in"
  CHECK ("clock_out_at" IS NULL OR "clock_out_at" > "clock_in_at");

ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_break_not_negative"
  CHECK ("break_minutes" >= 0);

-- The stored worked minutes must equal the interval less the break, in whole minutes. Storing it and
-- asserting it is the same choice made for the stock ledger's running balance: a figure that can be
-- reported on, where a disagreement is an error rather than a difference of opinion.
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_worked_minutes_consistent"
  CHECK (
    ("clock_out_at" IS NULL AND "worked_minutes" IS NULL)
    OR (
      "clock_out_at" IS NOT NULL
      AND "worked_minutes" IS NOT NULL
      AND "worked_minutes" = (EXTRACT(EPOCH FROM ("clock_out_at" - "clock_in_at")) / 60)::int - "break_minutes"
    )
  );

-- An approval is either absent or complete: "approved by someone, at no time" is not a state that
-- anyone can defend when the hours are questioned.
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_approval_is_all_or_nothing"
  CHECK (num_nonnulls("approved_by_id", "approved_at") IN (0, 2));

-- ── Payroll reconciles ───────────────────────────────────────────────────────
-- The run's net must follow from the figures stored beside it:
--   net = gross + bonuses − deductions − the employees' contributions
-- The employer's contribution is deliberately NOT in that formula: it is an additional cost to the
-- business, not a deduction from the employee, and subtracting it would understate every net wage.
ALTER TABLE "payroll_run" ADD CONSTRAINT "payroll_run_net_reconciles"
  CHECK (
    "net_total" = "gross_total" + "bonus_total" - "deduction_total" - "employee_contribution_total"
  );

ALTER TABLE "payroll_run" ADD CONSTRAINT "payroll_run_period_ordered"
  CHECK ("period_end" >= "period_start");

ALTER TABLE "payroll_run" ADD CONSTRAINT "payroll_run_amounts_not_negative"
  CHECK (
    "gross_total" >= 0 AND "bonus_total" >= 0 AND "deduction_total" >= 0
    AND "employee_contribution_total" >= 0 AND "employer_contribution_total" >= 0
    AND "net_total" >= 0
  );

-- The same formula, one employee at a time.
ALTER TABLE "payslip" ADD CONSTRAINT "payslip_net_reconciles"
  CHECK (
    "net_amount" = "gross_amount" + "bonus_amount" - "deduction_amount" - "employee_contribution_amount"
  );

ALTER TABLE "payslip" ADD CONSTRAINT "payslip_amounts_not_negative"
  CHECK (
    "gross_amount" >= 0 AND "bonus_amount" >= 0 AND "deduction_amount" >= 0
    AND "employee_contribution_amount" >= 0 AND "employer_contribution_amount" >= 0
    AND "net_amount" >= 0
    AND ("hours" IS NULL OR "hours" >= 0)
  );

