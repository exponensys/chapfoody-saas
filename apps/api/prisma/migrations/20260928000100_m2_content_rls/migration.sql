-- ═════════════════════════════════════════════════════════════════════════════
-- Row-level security for the platform's own content.
--
-- ── A different question from every other domain ─────────────────────────────
-- Every policy written so far answers "whose data is this?". These answer a different one: "is this
-- PUBLIC yet, and may this caller write it?". There is no tenant here — the blog and the vidéothèque
-- belong to Chapfoody, not to a business — so `cf_apply_tenant_rls()` has nothing to do (it iterates
-- tables carrying a `business_id`, and none of these do). Every policy below is written by hand.
--
-- ── The risk being removed ───────────────────────────────────────────────────
-- Not a competitor reading your rows: a DRAFT becoming public. The public site runs with no user in
-- context, so a single forgotten `where status = 'PUBLISHED'` in a listing endpoint would publish an
-- unfinished article, an unmoderated comment, or a screenshot of an unreleased screen. The policies
-- make that omission harmless rather than fatal.
--
-- ── Who may write ────────────────────────────────────────────────────────────
-- `cf_is_platform_admin()` is true only for a SUPER_ADMIN — the role the plan already describes as
-- "the only role that may reach /admin". It reads `app_user` directly, which is safe here because
-- that table carries no RLS of its own and is not reachable through these policies.
--
-- ── One deliberate exception: comments are written by the public ──────────────
-- A visitor must be able to post a comment, so `blog_comment` admits an INSERT from anyone — but ONLY
-- with status PENDING. The moderation state is therefore not something a controller can pass through:
-- a row that arrives APPROVED is refused by the policy. Moderation itself is an UPDATE and requires
-- an admin.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── Is the caller platform staff? ────────────────────────────────────────────
-- STABLE, so it is evaluated once per statement rather than once per row. Unset context returns false,
-- which is the fail-closed direction: an anonymous visitor is never an admin.
CREATE OR REPLACE FUNCTION cf_is_platform_admin() RETURNS boolean
  LANGUAGE sql STABLE PARALLEL SAFE
  AS $$
    SELECT EXISTS (
      SELECT 1 FROM "app_user" u
      WHERE u.id = cf_current_user_id()
        AND u.platform_role = 'SUPER_ADMIN'
        AND u.deleted_at IS NULL
    )
  $$;

-- ── Taxonomy and the tag join: readable, admin-writable ──────────────────────
-- A category name and a tag are navigation metadata, not editorial copy: there is nothing in them to
-- keep private, and the public site needs them to render a post's own page.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['blog_category', 'blog_tag', 'blog_post_tag', 'video_collection']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_public_read', t);
    EXECUTE format('CREATE POLICY %I ON %I FOR SELECT USING (true)', t || '_public_read', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_admin_write', t);
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR ALL TO PUBLIC USING (cf_is_platform_admin()) WITH CHECK (cf_is_platform_admin())',
      t || '_admin_write', t);
  END LOOP;
END $$;

-- ── Articles, videos, case studies, pages, use cases ─────────────────────────
-- Readable once they are PUBLISHED, or once their scheduled moment has passed, or by an admin. The
-- scheduled clause is what makes a publication queue safe: a post dated tomorrow is invisible today,
-- enforced by the database rather than by the job that was supposed to flip the flag.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['blog_post', 'video', 'case_study', 'page', 'use_case']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_published_read', t);
    EXECUTE format($f$
      CREATE POLICY %I ON %I FOR SELECT
        USING (
          ("status" = 'PUBLISHED' AND "published_at" <= now())
          OR ("status" = 'SCHEDULED' AND "scheduled_for" <= now())
          OR cf_is_platform_admin()
        )
    $f$, t || '_published_read', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_admin_write', t);
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR ALL TO PUBLIC USING (cf_is_platform_admin()) WITH CHECK (cf_is_platform_admin())',
      t || '_admin_write', t);
  END LOOP;
END $$;

-- ── Comments ─────────────────────────────────────────────────────────────────
ALTER TABLE "blog_comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "blog_comment" FORCE ROW LEVEL SECURITY;

-- The public reads only what an editor has approved.
DROP POLICY IF EXISTS blog_comment_approved_read ON "blog_comment";
CREATE POLICY blog_comment_approved_read ON "blog_comment"
  FOR SELECT
  USING ("status" = 'APPROVED' OR cf_is_platform_admin());

-- Anyone may leave a comment; nobody may leave an approved one. This is the policy that makes the
-- moderation state impossible to bypass from the application.
DROP POLICY IF EXISTS blog_comment_pending_insert ON "blog_comment";
CREATE POLICY blog_comment_pending_insert ON "blog_comment"
  FOR INSERT
  WITH CHECK ("status" = 'PENDING');

-- Moderation, and only moderation, is an admin action. Moving a comment back to PENDING is allowed
-- too — an editor reopening a rejected one is normal — and the table's CHECK still demands a
-- moderator timestamp for anything that is not PENDING.
DROP POLICY IF EXISTS blog_comment_moderate ON "blog_comment";
CREATE POLICY blog_comment_moderate ON "blog_comment"
  FOR UPDATE
  USING (cf_is_platform_admin())
  WITH CHECK (cf_is_platform_admin());

DROP POLICY IF EXISTS blog_comment_remove ON "blog_comment";
CREATE POLICY blog_comment_remove ON "blog_comment"
  FOR DELETE
  USING (cf_is_platform_admin());

-- ── The media library and the SEO overrides: admin only ──────────────────────
-- An unpublished screenshot is not something the public should be able to enumerate, even though its
-- URL would work once known, and an SEO override is operational configuration rather than content.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['media', 'seo_meta']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_admin_only', t);
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR ALL TO PUBLIC USING (cf_is_platform_admin()) WITH CHECK (cf_is_platform_admin())',
      t || '_admin_only', t);
  END LOOP;
END $$;

