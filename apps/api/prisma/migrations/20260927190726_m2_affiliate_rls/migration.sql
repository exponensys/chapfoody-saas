-- ═════════════════════════════════════════════════════════════════════════════
-- Row-level security for the affiliate programme.
--
-- One line, and no exceptions: every table here belongs entirely to one business. An affiliate, their
-- links, what they referred, what they earned and how they were paid are all the programme owner's
-- data, and no cross-tenant read is legitimate in any case — a competitor's partner list would be a
-- competitor's customer list.
--
-- Note what is NOT append-only: commissions and payouts change status as they are approved and paid,
-- and a referral is confirmed or rejected after review. The only thing here that behaves like a
-- ledger is `referral_link.clicks`, and that is a counter rather than history — a click's value is in
-- the aggregate, and a row per click would be the largest table in the schema within a month.
-- ═════════════════════════════════════════════════════════════════════════════

SELECT cf_apply_tenant_rls();
