-- ═════════════════════════════════════════════════════════════════════════════
-- Row-level security for the storefront.
--
-- No exceptions and no hand-written policies: everything in this domain that belongs to a business is
-- ordinary tenant data, and `cf_apply_tenant_rls()` covers it.
--
-- `theme` is deliberately NOT covered, and the reason is worth stating. The theme PRESETS are
-- platform data — like plans, features and business types — with no `business_id` to scope on. They
-- are a catalogue of designs every tenant may choose from, not anybody's private data, and the
-- isolation check only requires RLS on tables that carry a tenant reference. `website_theme` is the
-- tenant's own resolved copy and IS covered.
--
-- Note what this domain makes visible: a storefront is the one part of the platform served to people
-- who are not signed in and are not the tenant. That does not change the policy — the public read
-- path runs with a tenant context resolved from the hostname, and unpublished rows are filtered by
-- the application for the same reason they always are: the policy answers "whose data", not "which
-- of it is public".
-- ═════════════════════════════════════════════════════════════════════════════

SELECT cf_apply_tenant_rls();
