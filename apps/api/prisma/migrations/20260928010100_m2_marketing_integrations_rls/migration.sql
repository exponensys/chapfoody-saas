-- ═════════════════════════════════════════════════════════════════════════════
-- Row-level security for marketing and integrations.
--
-- Two things happen here, and the order matters — the same two-part shape as stock, consent and the
-- rest of the ledgers.
--
-- 1. `loyalty_transaction` gets its policies written by hand FIRST, because it is a LEDGER. A points
--    history that can be rewritten cannot answer "why do I only have 40 points?", which is the only
--    question it exists to answer. No UPDATE and no DELETE policy, so both are denied for the
--    application role: a correction is a new ADJUSTMENT row, and the original survives beside it —
--    which is exactly what makes it visible.
--
-- 2. `cf_apply_tenant_rls()` then covers the other sixteen, skipping the table above because it
--    already has a policy. Every one of these tables is ordinary tenant data with no platform rows,
--    including `job_run`, whose `business_id` is nullable: a platform job is visible to nobody but
--    the worker, which is the correct default rather than an oversight.
-- ═════════════════════════════════════════════════════════════════════════════

ALTER TABLE "loyalty_transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "loyalty_transaction" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS loyalty_transaction_read ON "loyalty_transaction";
CREATE POLICY loyalty_transaction_read ON "loyalty_transaction"
  FOR SELECT
  USING (business_id = cf_current_business_id());

DROP POLICY IF EXISTS loyalty_transaction_append ON "loyalty_transaction";
CREATE POLICY loyalty_transaction_append ON "loyalty_transaction"
  FOR INSERT
  WITH CHECK (business_id = cf_current_business_id());

-- No UPDATE policy and no DELETE policy. A points balance that can be edited directly has no history,
-- and the whole reason to keep a ledger is to be able to explain the balance it produced.

-- Everything else in this domain: the standard tenant policy.
SELECT cf_apply_tenant_rls();
