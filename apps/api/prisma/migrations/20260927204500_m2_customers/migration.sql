-- CreateEnum
CREATE TYPE "customer_status" AS ENUM ('LEAD', 'ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "customer_source" AS ENUM ('POS', 'STOREFRONT', 'REFERRAL', 'IMPORT', 'MANUAL', 'MARKETPLACE');

-- CreateEnum
CREATE TYPE "consent_channel" AS ENUM ('EMAIL', 'SMS', 'PUSH', 'WHATSAPP', 'PHONE');

-- CreateEnum
CREATE TYPE "consent_purpose" AS ENUM ('MARKETING', 'TRANSACTIONAL', 'PROFILING', 'THIRD_PARTY');

-- CreateEnum
CREATE TYPE "consent_status" AS ENUM ('GRANTED', 'DENIED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "consent_source" AS ENUM ('WEB', 'POS', 'IMPORT', 'API', 'VERBAL');

-- AlterTable
ALTER TABLE "customer_order" ADD COLUMN     "customer_id" TEXT;

-- AlterTable
ALTER TABLE "referral" DROP COLUMN "customer_ref",
ADD COLUMN     "customer_id" TEXT;

-- CreateTable
CREATE TABLE "customer" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "user_id" TEXT,
    "number" VARCHAR(32) NOT NULL,
    "first_name" VARCHAR(120) NOT NULL,
    "last_name" VARCHAR(120),
    "company_name" VARCHAR(200),
    "email" VARCHAR(320),
    "phone" VARCHAR(32),
    "birth_date" DATE,
    "locale" VARCHAR(10),
    "avatar_url" VARCHAR(500),
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "customer_status" NOT NULL DEFAULT 'LEAD',
    "source" "customer_source" NOT NULL DEFAULT 'MANUAL',
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "total_spent" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "loyalty_points" INTEGER NOT NULL DEFAULT 0,
    "first_order_at" TIMESTAMP(3),
    "last_order_at" TIMESTAMP(3),
    "anonymized_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),
    "metadata" JSONB,
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_address" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "label" VARCHAR(60),
    "recipient_name" VARCHAR(120),
    "recipient_phone" VARCHAR(32),
    "address_line1" VARCHAR(200) NOT NULL,
    "address_line2" VARCHAR(200),
    "city" VARCHAR(120) NOT NULL,
    "region" VARCHAR(120),
    "postal_code" VARCHAR(32),
    "country" CHAR(2) NOT NULL,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "delivery_instructions" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_note" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "author_id" TEXT,
    "body" TEXT NOT NULL,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_consent" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "channel" "consent_channel" NOT NULL,
    "purpose" "consent_purpose" NOT NULL,
    "status" "consent_status" NOT NULL,
    "source" "consent_source" NOT NULL,
    "policy_version" VARCHAR(32),
    "legal_text" TEXT,
    "ip_address" INET,
    "user_agent" TEXT,
    "context_ref" VARCHAR(200),
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_consent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customer_business_id_status_last_name_idx" ON "customer"("business_id", "status", "last_name");

-- CreateIndex
CREATE INDEX "customer_business_id_last_order_at_idx" ON "customer"("business_id", "last_order_at");

-- CreateIndex
CREATE INDEX "customer_business_id_phone_idx" ON "customer"("business_id", "phone");

-- CreateIndex
CREATE INDEX "customer_user_id_idx" ON "customer"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_business_id_number_key" ON "customer"("business_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "customer_business_id_user_id_key" ON "customer"("business_id", "user_id");

-- CreateIndex
CREATE INDEX "customer_address_customer_id_is_default_idx" ON "customer_address"("customer_id", "is_default");

-- CreateIndex
CREATE INDEX "customer_note_customer_id_is_pinned_created_at_idx" ON "customer_note"("customer_id", "is_pinned", "created_at");

-- CreateIndex
CREATE INDEX "customer_consent_customer_id_channel_purpose_recorded_at_idx" ON "customer_consent"("customer_id", "channel", "purpose", "recorded_at");

-- CreateIndex
CREATE INDEX "customer_consent_business_id_channel_status_idx" ON "customer_consent"("business_id", "channel", "status");

-- CreateIndex
CREATE INDEX "customer_order_customer_id_placed_at_idx" ON "customer_order"("customer_id", "placed_at");

-- CreateIndex
CREATE INDEX "referral_customer_id_idx" ON "referral"("customer_id");

-- AddForeignKey
ALTER TABLE "referral" ADD CONSTRAINT "referral_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_note" ADD CONSTRAINT "customer_note_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_note" ADD CONSTRAINT "customer_note_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_note" ADD CONSTRAINT "customer_note_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_consent" ADD CONSTRAINT "customer_consent_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_consent" ADD CONSTRAINT "customer_consent_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_order" ADD CONSTRAINT "customer_order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- ═════════════════════════════════════════════════════════════════════════════
-- Constraints Prisma cannot express, for customers.
--
-- Note on the DROP COLUMN above: `referral.customer_ref` was a free-text placeholder added when the
-- affiliate domain landed, before there was a customer table to point at. It is replaced by a real
-- foreign key. The dropped values were placeholder strings produced by the seed, so nothing of value
-- is lost — and this is the only migration in the project that knowingly discards data.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── One default address per customer ─────────────────────────────────────────
-- A partial unique index rather than a CHECK, because the rule is about the SET of a customer's
-- addresses and not about any one row. `WHERE "is_default"` lets a customer have many addresses and
-- at most one flagged: the only way "deliver to my usual" has a single answer.
CREATE UNIQUE INDEX "customer_address_one_default_per_customer"
  ON "customer_address" ("customer_id") WHERE "is_default";

-- ── Customers are deduplicated, but only where there is something to match on ─
-- Case-insensitively on the email: Nadia@x and nadia@x are one person, and a duplicate customer
-- means a split order history, split loyalty points and a "total spent" that is wrong twice.
--
-- Both indexes are PARTIAL, and that is the whole design. A customer captured at the counter with
-- only a phone number has no email; several such customers must coexist. A plain unique index would
-- refuse the second one — so the rule is "at most one per distinct non-null value", not "non-null".
--
-- Excluding anonymised rows matters for the same reason: erasure nulls the identifiers, and the
-- index must not then block a new customer who happens to reuse the freed address.
CREATE UNIQUE INDEX "customer_unique_email_per_business"
  ON "customer" ("business_id", lower("email"))
  WHERE "email" IS NOT NULL AND "anonymized_at" IS NULL;

CREATE UNIQUE INDEX "customer_unique_phone_per_business"
  ON "customer" ("business_id", "phone")
  WHERE "phone" IS NOT NULL AND "anonymized_at" IS NULL;

-- ── Counters and totals stay sane ────────────────────────────────────────────
ALTER TABLE "customer" ADD CONSTRAINT "customer_totals_not_negative"
  CHECK ("total_orders" >= 0 AND "total_spent" >= 0 AND "loyalty_points" >= 0);

-- An order history with no orders has no last order. A sentinel date standing in for "never" is how
-- a customer list ends up claiming everyone last bought something in 1970.
ALTER TABLE "customer" ADD CONSTRAINT "customer_last_order_agrees_with_count"
  CHECK ("total_orders" > 0 OR "last_order_at" IS NULL);

ALTER TABLE "customer" ADD CONSTRAINT "customer_order_dates_ordered"
  CHECK (
    "first_order_at" IS NULL OR "last_order_at" IS NULL OR "last_order_at" >= "first_order_at"
  );

-- ── Anonymisation has to actually anonymise ──────────────────────────────────
-- Erasure is only real if the identifiers are gone, and the point of the column is that someone can
-- PROVE they were removed. "We ran the job" is not proof; a constraint is. This is enforced rather
-- than trusted because it is the one operation in the system that cannot be undone.
ALTER TABLE "customer" ADD CONSTRAINT "customer_anonymised_has_no_pii"
  CHECK (
    "anonymized_at" IS NULL
    OR (
      "email" IS NULL AND "phone" IS NULL AND "last_name" IS NULL AND "company_name" IS NULL
      AND "user_id" IS NULL
    )
  );

-- ── A saved pin needs both halves ────────────────────────────────────────────
-- A latitude without a longitude is not a location, and a delivery priced from half a coordinate is
-- priced from nothing. Ranges are checked too: a swapped pair is a silent 90° error otherwise.
ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_coordinates_complete_and_sane"
  CHECK (
    (("latitude" IS NULL) = ("longitude" IS NULL))
    AND ("latitude" IS NULL OR "latitude" BETWEEN -90 AND 90)
    AND ("longitude" IS NULL OR "longitude" BETWEEN -180 AND 180)
  );

-- ── Consent to WHAT? ─────────────────────────────────────────────────────────
-- A granted consent that records neither the wording nor the version of it proves nothing. Policies
-- get rewritten, and "they agreed" is not an answer without the text they agreed to. Denials and
-- withdrawals are exempt: refusing is not something anyone needs to evidence.
ALTER TABLE "customer_consent" ADD CONSTRAINT "customer_consent_grant_records_its_terms"
  CHECK (
    "status" <> 'GRANTED'
    OR ("policy_version" IS NOT NULL OR "legal_text" IS NOT NULL)
  );

