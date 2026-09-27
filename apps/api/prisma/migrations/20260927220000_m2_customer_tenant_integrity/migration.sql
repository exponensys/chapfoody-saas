-- ═════════════════════════════════════════════════════════════════════════════
-- Tenant integrity for the customers domain: make the business_id part of the foreign key.
--
-- ── What was wrong ───────────────────────────────────────────────────────────
-- The three child tables pointed at `customer(id)` alone. That let one tenant file a row of its own
-- against ANOTHER tenant's customer:
--
--     -- as tenant B, naming tenant A's customer
--     insert into customer_consent (business_id, customer_id, ...) values ('B', 'A-customer', ...);
--
-- The scoping layer rewrites business_id to the caller's context, so the INSERT policy is satisfied.
-- The plain foreign key is satisfied too, because that customer genuinely exists. Nothing leaks —
-- tenant A never sees the row — but the reference is real, and any query that joins on customer_id
-- WITHOUT also matching business_id would follow it into another tenant's data.
--
-- A test in the isolation suite tried exactly that insert and was allowed. This migration is the fix.
--
-- ── Why the unique index is needed ───────────────────────────────────────────
-- A foreign key must have something to point at. `customer.id` is already unique, but a COMPOSITE
-- key needs a composite target, so (business_id, id) is declared unique. It is redundant as a
-- constraint and load-bearing as an anchor: without it the composite keys below cannot exist.
--
-- ── What it costs ────────────────────────────────────────────────────────────
-- One extra index on `customer`, and inserts to the three child tables now check two columns instead
-- of one. That is the whole cost, and it buys a guarantee the application could not have provided.
-- ═════════════════════════════════════════════════════════════════════════════

-- DropForeignKey
ALTER TABLE "customer_address" DROP CONSTRAINT "customer_address_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "customer_consent" DROP CONSTRAINT "customer_consent_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "customer_note" DROP CONSTRAINT "customer_note_customer_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "customer_business_id_id_key" ON "customer"("business_id", "id");

-- AddForeignKey
ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_business_id_customer_id_fkey" FOREIGN KEY ("business_id", "customer_id") REFERENCES "customer"("business_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_note" ADD CONSTRAINT "customer_note_business_id_customer_id_fkey" FOREIGN KEY ("business_id", "customer_id") REFERENCES "customer"("business_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_consent" ADD CONSTRAINT "customer_consent_business_id_customer_id_fkey" FOREIGN KEY ("business_id", "customer_id") REFERENCES "customer"("business_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;
