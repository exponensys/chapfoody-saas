-- ═════════════════════════════════════════════════════════════════════════════
-- Row-level security for customers.
--
-- The same two-part shape as the stock and sales domains, and for the same reason.
--
-- 1. `customer_consent` gets its policies written by hand FIRST, because it is a LEDGER. Consent is
--    evidence, and evidence that can be edited is not evidence. With no UPDATE and no DELETE policy,
--    both commands are denied outright for the application role: withdrawing consent inserts a
--    WITHDRAWN row, and the earlier GRANTED row survives — which is the entire point. A single
--    "opt-in" boolean on the customer would have destroyed exactly the record that matters.
--
-- 2. `cf_apply_tenant_rls()` then covers everything else. It skips tables that already have a
--    policy, so the hand-written set above survives — the mechanism and its exceptions compose.
--
-- `customer` itself is ordinary tenant data, and customers are the most sensitive personal data in
-- the schema. That is precisely why the tenant policy is enough: a competitor must not read your
-- customer list, and a SUPERUSER does not bypass these policies because the application role is
-- NOSUPERUSER NOBYPASSRLS. Anonymisation, not deletion, is the exit route (see the customers
-- migration) — because the accounting domain has to keep the sale.
-- ═════════════════════════════════════════════════════════════════════════════

ALTER TABLE "customer_consent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "customer_consent" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS customer_consent_read ON "customer_consent";
CREATE POLICY customer_consent_read ON "customer_consent"
  FOR SELECT
  USING (business_id = cf_current_business_id());

DROP POLICY IF EXISTS customer_consent_append ON "customer_consent";
CREATE POLICY customer_consent_append ON "customer_consent"
  FOR INSERT
  WITH CHECK (business_id = cf_current_business_id());

-- No UPDATE policy and no DELETE policy, deliberately. A withdrawal is a new WITHDRAWN row, never an
-- edit of the GRANTED one: the question a regulator asks is what was agreed AND what was later
-- refused, and an in-place update answers only the second.

-- Everything else in this domain: the standard tenant policy.
SELECT cf_apply_tenant_rls();
