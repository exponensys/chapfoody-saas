-- ═════════════════════════════════════════════════════════════════════════════
-- Row-level security for sales and front of house.
--
-- Same shape as the inventory migration: the append-only table is written by hand FIRST
-- (so `cf_apply_tenant_rls()` skips it), then the function covers everything else.
--
-- `order_status_history` is append-only because "why was this order cancelled after the
-- kitchen had already made it?" must stay answerable. With no UPDATE and no DELETE policy,
-- those commands are denied for the application role rather than merely unused.
-- ═════════════════════════════════════════════════════════════════════════════

ALTER TABLE "order_status_history" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_status_history" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS order_status_history_read ON "order_status_history";
CREATE POLICY order_status_history_read ON "order_status_history"
  FOR SELECT
  USING (business_id = cf_current_business_id());

DROP POLICY IF EXISTS order_status_history_append ON "order_status_history";
CREATE POLICY order_status_history_append ON "order_status_history"
  FOR INSERT
  WITH CHECK (business_id = cf_current_business_id());

-- Every other table in this domain: the standard tenant policy.
SELECT cf_apply_tenant_rls();
