-- ═════════════════════════════════════════════════════════════════════════════
-- Row-level security for delivery.
--
-- `delivery_event` is append-only, like the other timelines: it is what a dispute is argued from, and
-- a timeline someone can edit settles nothing. Note what is NOT append-only — `delivery` and
-- `driver_earning` both change state as the work progresses (assigned → picked up → delivered, and
-- pending → approved → paid), so they need the ordinary tenant policy rather than the stricter one.
-- Getting that distinction backwards would break the workflow; getting it wrong the other way would
-- leave a lie standing.
-- ═════════════════════════════════════════════════════════════════════════════

ALTER TABLE "delivery_event" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "delivery_event" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS delivery_event_read ON "delivery_event";
CREATE POLICY delivery_event_read ON "delivery_event"
  FOR SELECT
  USING (business_id = cf_current_business_id());

DROP POLICY IF EXISTS delivery_event_append ON "delivery_event";
CREATE POLICY delivery_event_append ON "delivery_event"
  FOR INSERT
  WITH CHECK (business_id = cf_current_business_id());

-- Everything else: driver, company, roster, zones, radius bands, deliveries and earnings.
SELECT cf_apply_tenant_rls();
