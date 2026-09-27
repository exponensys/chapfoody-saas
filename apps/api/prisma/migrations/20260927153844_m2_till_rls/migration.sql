-- ═════════════════════════════════════════════════════════════════════════════
-- Row-level security for the till, payments and tax.
--
-- The append-only tables are written by hand first — `cf_apply_tenant_rls()` skips any table
-- that already has a policy — and the function then covers the rest.
--
-- Both append-only tables here are financial. `cash_movement` is the drawer's history: a
-- cashier who can edit the movements can make the drawer balance. `refund` is money leaving the
-- business: the ability to delete a refund quietly is the ability to hide a theft. In both
-- cases the correction exists and is visible (ADJUSTMENT, or a second refund), which is what
-- makes the first one legible months later.
-- ═════════════════════════════════════════════════════════════════════════════

ALTER TABLE "cash_movement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cash_movement" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cash_movement_read ON "cash_movement";
CREATE POLICY cash_movement_read ON "cash_movement"
  FOR SELECT
  USING (business_id = cf_current_business_id());

DROP POLICY IF EXISTS cash_movement_append ON "cash_movement";
CREATE POLICY cash_movement_append ON "cash_movement"
  FOR INSERT
  WITH CHECK (business_id = cf_current_business_id());

ALTER TABLE "refund" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "refund" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS refund_read ON "refund";
CREATE POLICY refund_read ON "refund"
  FOR SELECT
  USING (business_id = cf_current_business_id());

DROP POLICY IF EXISTS refund_append ON "refund";
CREATE POLICY refund_append ON "refund"
  FOR INSERT
  WITH CHECK (business_id = cf_current_business_id());

-- Everything else in this domain: the standard tenant policy.
SELECT cf_apply_tenant_rls();
