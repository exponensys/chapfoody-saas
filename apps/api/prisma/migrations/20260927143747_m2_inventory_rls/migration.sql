-- ═════════════════════════════════════════════════════════════════════════════
-- Row-level security for stock and purchasing.
--
-- Two things happen here, and the order matters.
--
-- 1. `stock_movement` gets its policies written by hand FIRST, because it is a ledger and
--    a ledger that can be rewritten cannot explain anything. With no UPDATE and no DELETE
--    policy, those commands are denied outright for the application role.
--
-- 2. `cf_apply_tenant_rls()` then covers everything else. It skips any table that already
--    has a policy, which is exactly what protects the hand-written set above — and the
--    hand-written policies on business, business_member, invitation and audit_log from the
--    earlier migrations. The mechanism and the exceptions compose instead of fighting.
-- ═════════════════════════════════════════════════════════════════════════════

ALTER TABLE "stock_movement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "stock_movement" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS stock_movement_read ON "stock_movement";
CREATE POLICY stock_movement_read ON "stock_movement"
  FOR SELECT
  USING (business_id = cf_current_business_id());

DROP POLICY IF EXISTS stock_movement_append ON "stock_movement";
CREATE POLICY stock_movement_append ON "stock_movement"
  FOR INSERT
  WITH CHECK (business_id = cf_current_business_id());

-- No UPDATE policy and no DELETE policy: a stock history that can be edited proves
-- nothing, and the whole reason to keep a ledger is to be able to detect that an assumed
-- number is wrong. Corrections are new movements — reason ADJUSTMENT or STOCK_COUNT —
-- which is also what makes them visible in the report.

-- Everything else in this domain: the standard tenant policy.
SELECT cf_apply_tenant_rls();
