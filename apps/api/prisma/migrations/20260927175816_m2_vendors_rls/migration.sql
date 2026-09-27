-- ═════════════════════════════════════════════════════════════════════════════
-- Row-level security for vendors.
--
-- No hand-written policies here: nothing in this domain has a rule beyond tenancy. A vendor, their
-- commission rules, what they were credited with and their targets all belong entirely to one
-- business, and no cross-tenant read is legitimate in any circumstance — including for reporting,
-- since a commission report is per business by definition.
--
-- Which is the point of the reconcile function: a domain like this one costs a single line, and the
-- earlier domains that DID need special policies (append-only ledgers, draft-only journals) keep
-- them, because it skips any table that already has a policy.
-- ═════════════════════════════════════════════════════════════════════════════

SELECT cf_apply_tenant_rls();
