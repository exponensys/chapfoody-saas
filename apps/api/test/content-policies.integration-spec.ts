import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../src/generated/prisma/client.js';
import { runAsTenant } from '../src/infra/prisma/tenant-context.js';

/**
 * The platform content policies, against a real PostgreSQL.
 *
 * ── What this suite exists to prove ───────────────────────────────────────────
 * The blog, the vidéothèque and the rest of the platform's content are the ONE domain with no
 * `business_id`, so they are the one domain where the tenant policy proves nothing. Their policies
 * answer a different question — "is this PUBLIC yet, and may this caller write it?" — and until this
 * suite existed, that question was only checked by a throwaway probe against a local database. A
 * policy verified by a script nobody runs again is a policy that will be broken by the next schema
 * change without anyone finding out.
 *
 * The failure it guards against is not a competitor reading rows. It is a DRAFT becoming public: the
 * public site runs with no user in context, so one forgotten `where status = 'PUBLISHED'` in a listing
 * endpoint would publish an unfinished article, an unmoderated comment, or a screenshot of a screen
 * nobody has seen yet.
 *
 * ── Three callers, and the middle one is the point ────────────────────────────
 * Every assertion here is made from one of three contexts, because the interesting statement is not
 * "an anonymous visitor sees nothing unpublished" — it is that a SIGNED-IN NON-ADMIN sees no more.
 * Being authenticated is not being platform staff, and a policy written as "any userId may read
 * drafts" would pass a two-context test and fail this one.
 *
 *   anonymous (no context at all)   published only
 *   an ordinary signed-in user      published only — identical to anonymous
 *   a SUPER_ADMIN                   everything, and the only context that may write
 *
 * ── What it leaves behind ─────────────────────────────────────────────────────
 * Probe rows carry a per-run suffix. The users it creates are deleted; the content it creates is
 * deleted in an admin context. A local database is cleared fully by `pnpm db:reset`.
 *
 *   INTEGRATION_DATABASE_URL="postgresql://chapfoody_app:…@localhost:5432/chapfoody_db" \
 *     pnpm --filter @chapfoody/api test:integration
 */
const databaseUrl = process.env.INTEGRATION_DATABASE_URL;
const describeWhenConfigured = databaseUrl === undefined ? describe.skip : describe;

if (databaseUrl === undefined) {
  process.stdout.write(
    '\n⏭  Skipping the content policy suite: INTEGRATION_DATABASE_URL is not set.\n' +
      '   It must be an application role (NOSUPERUSER NOBYPASSRLS), not the owner.\n\n',
  );
}

describeWhenConfigured('Content publication policies (integration)', () => {
  let prisma: PrismaClient;

  // Unique per run, so a repeated run never collides with a previous one's residue.
  const suffix = `pub${Date.now().toString(36)}`;

  let adminId = '';
  let staffId = '';

  /** Ids created by this run, so the cleanup can remove exactly its own rows. */
  const createdPosts: string[] = [];
  const createdComments: string[] = [];
  const createdMedia: string[] = [];
  const createdSeo: string[] = [];

  beforeAll(async () => {
    prisma = new PrismaClient({ adapter: new PrismaPg(databaseUrl as string) });

    // ── The role check ───────────────────────────────────────────────────────
    // Same guard as the tenant suite, and for the same reason: as the owner or a BYPASSRLS role every
    // assertion below would pass unconditionally, which is worse than not testing at all.
    const [role] = await prisma.$queryRaw<
      { who: string; superuser: boolean; bypassrls: boolean }[]
    >`SELECT current_user AS who,
             (SELECT rolsuper FROM pg_roles WHERE rolname = current_user) AS superuser,
             (SELECT rolbypassrls FROM pg_roles WHERE rolname = current_user) AS bypassrls`;

    if (role?.superuser === true || role?.bypassrls === true) {
      throw new Error(
        `INTEGRATION_DATABASE_URL connects as "${role.who}", which bypasses row-level ` +
          'security. These tests would pass without proving anything. Use the ' +
          'application role instead (see prisma/sql/app-role.sql).',
      );
    }

    // ── Fixtures ─────────────────────────────────────────────────────────────
    // `app_user` carries no RLS of its own, so these need no context — which is what makes them usable
    // as the CONTEXT for everything else.
    const [admin, staff] = await Promise.all([
      prisma.user.create({
        data: {
          email: `content-admin-${suffix}@probe.test`,
          passwordHash: 'not-a-real-hash',
          firstName: 'Probe',
          lastName: 'Admin',
          status: 'ACTIVE',
          // The role the plan describes as "the only role that may reach /admin".
          platformRole: 'SUPER_ADMIN',
        },
      }),
      prisma.user.create({
        data: {
          email: `content-staff-${suffix}@probe.test`,
          passwordHash: 'not-a-real-hash',
          firstName: 'Probe',
          lastName: 'Staff',
          status: 'ACTIVE',
        },
      }),
    ]);

    adminId = admin.id;
    staffId = staff.id;
  }, 30_000);

  afterAll(async () => {
    if (prisma === undefined) {
      return;
    }

    // Cleanup runs in the admin context because that is the only context the policies allow to delete
    // content. It is also a second, incidental proof that the admin path works: if the write policies
    // were broken, this would silently delete nothing rather than throwing.
    await runAsTenant(prisma, { userId: adminId }, async (tx) => {
      await tx.blogComment.deleteMany({ where: { id: { in: createdComments } } });
      await tx.blogPost.deleteMany({ where: { id: { in: createdPosts } } });
      await tx.media.deleteMany({ where: { id: { in: createdMedia } } });
      await tx.seoMeta.deleteMany({ where: { id: { in: createdSeo } } });
    }).catch(() => undefined);

    await prisma.user.deleteMany({ where: { id: { in: [adminId, staffId] } } });
    await prisma.$disconnect();
  }, 30_000);

  it('lets a platform admin write every publication state', async () => {
    const written = await runAsTenant(
      prisma,
      { userId: adminId },
      async (tx) => {
        // PUBLISHED, and already live: readable by anyone, including the past date that a CHECK
        // requires for this state.
        const published = await tx.blogPost.create({
          data: {
            slug: `published-${suffix}`,
            title: 'Published probe',
            body: 'Body',
            status: 'PUBLISHED',
            publishedAt: new Date(Date.now() - 60_000),
            authorId: adminId,
          },
        });

        // SCHEDULED for tomorrow: a real state, and the one whose visibility is tested below.
        const scheduled = await tx.blogPost.create({
          data: {
            slug: `scheduled-${suffix}`,
            title: 'Scheduled probe',
            body: 'Body',
            status: 'SCHEDULED',
            scheduledFor: new Date(Date.now() + 24 * 60 * 60_000),
            authorId: adminId,
          },
        });

        const draft = await tx.blogPost.create({
          data: {
            slug: `draft-${suffix}`,
            title: 'Draft probe',
            body: 'Body',
            status: 'DRAFT',
            authorId: adminId,
          },
        });

        return { published, scheduled, draft };
      },
    );

    createdPosts.push(written.published.id, written.scheduled.id, written.draft.id);

    expect(written.published.status).toBe('PUBLISHED');
    expect(written.scheduled.status).toBe('SCHEDULED');
    expect(written.draft.status).toBe('DRAFT');
  });

  it('shows an anonymous visitor only what is published', async () => {
    // No context at all: exactly what the public site runs with.
    const all = await runAsTenant(prisma, {}, (tx) =>
      tx.blogPost.findMany({ select: { id: true, status: true } }),
    );

    const mine = all.filter((post) => createdPosts.includes(post.id));

    // One of the three this run created: the published one. The SCHEDULED post is dated tomorrow and
    // the DRAFT is not published, and the database — not the query — is what excludes them.
    expect(mine).toHaveLength(1);
    expect(mine[0]?.status).toBe('PUBLISHED');
  });

  it('gives a signed-in non-admin no more than a visitor', async () => {
    const visible = await runAsTenant(prisma, { userId: staffId }, (tx) =>
      tx.blogPost.findMany({ select: { id: true, status: true } }),
    );

    const mine = visible.filter((post) => createdPosts.includes(post.id));

    // The assertion that a two-context test would miss: authentication is not authorisation, so a
    // policy of "any userId may read drafts" would fail here and nowhere else.
    expect(mine).toHaveLength(1);
    expect(mine[0]?.status).toBe('PUBLISHED');
  });

  it('shows a platform admin everything, drafts and the future included', async () => {
    const visible = await runAsTenant(prisma, { userId: adminId }, (tx) =>
      tx.blogPost.findMany({ select: { id: true, status: true } }),
    );

    const mine = visible.filter((post) => createdPosts.includes(post.id));

    expect(mine).toHaveLength(3);
    expect(mine.map((post) => post.status).sort()).toEqual(['DRAFT', 'PUBLISHED', 'SCHEDULED']);
  });


  it('lets anyone leave a comment, but only a PENDING one', async () => {
    const publishedPost = createdPosts[0] as string;
    const commentId = `probe-comment-${suffix}`;

    // The one table the public may write to. The policy admits a row ONLY with status PENDING, which
    // is what makes the moderation state impossible to bypass by passing it in from a request body.
    //
    // ── Why createMany and not create ─────────────────────────────────────────
    // `create` issues `INSERT ... RETURNING`, and PostgreSQL subjects the RETURNING clause to the
    // SELECT policy. A PENDING comment is deliberately invisible to the public, so the row it has just
    // written is not visible to it either, and the insert is refused outright — which is how this test
    // failed the first time it ran.
    //
    // That is not a quirk to work around; it is the policy being coherent. An anonymous writer cannot
    // read back what they wrote, by design, so the public path must insert WITHOUT asking for the row
    // back and the application must generate the id itself. Prisma's `@default(cuid())` runs on the
    // client, so that is never a problem — but the contract is worth stating, because the next person
    // to write this endpoint will reach for `create` by reflex.
    const written = await runAsTenant(prisma, {}, (tx) =>
      tx.blogComment.createMany({
        data: [
          {
            id: commentId,
            postId: publishedPost,
            authorName: 'Visiteur',
            body: 'Très utile, merci.',
            status: 'PENDING',
          },
        ],
      }),
    );

    createdComments.push(commentId);
    expect(written.count).toBe(1);

    // The same write carrying an approved status is refused by the POLICY, not by a validation rule
    // somebody could forget.
    await expect(
      runAsTenant(prisma, {}, (tx) =>
        tx.blogComment.createMany({
          data: [
            {
              id: `probe-approved-${suffix}`,
              postId: publishedPost,
              authorName: 'Spam',
              body: 'Achetez ici',
              status: 'APPROVED',
            },
          ],
        }),
      ),
    ).rejects.toThrow();

    // And the RETURNING path is closed as well — asserted rather than merely commented, because if a
    // future policy change silently reopened it, the public box would start working by accident while
    // the moderation guarantee was the thing that broke.
    await expect(
      runAsTenant(prisma, {}, (tx) =>
        tx.blogComment.create({
          data: {
            id: `probe-returning-${suffix}`,
            postId: publishedPost,
            authorName: 'Visiteur',
            body: 'Test',
            status: 'PENDING',
          },
        }),
      ),
    ).rejects.toThrow(/row-level security/);
  });

  it('does not let a visitor read or approve a pending comment', async () => {
    const pendingId = createdComments[0] as string;

    // Not readable while it is unmoderated — the visitor who just wrote it cannot read it back either,
    // because the read policy is about approval, not authorship. This is the same rule that makes
    // `create` unusable on the public path, seen from the other side.
    const visibleToVisitor = await runAsTenant(prisma, {}, (tx) =>
      tx.blogComment.findMany({ where: { id: pendingId }, select: { id: true } }),
    );

    expect(visibleToVisitor).toEqual([]);

    // Approving is an UPDATE, and there is no UPDATE policy for anyone but an admin. With no policy
    // the rows are simply not visible to the command, so the update affects nothing — which is the
    // append-only guarantee holding rather than an error being raised.
    const approved = await runAsTenant(prisma, {}, (tx) =>
      tx.blogComment.updateMany({ where: { id: pendingId }, data: { status: 'APPROVED' } }),
    );

    expect(approved.count).toBe(0);

    // And an admin can moderate it, which is the half that proves the policy is a restriction rather
    // than a wall.
    const moderated = await runAsTenant(prisma, { userId: adminId }, (tx) =>
      tx.blogComment.updateMany({
        where: { id: pendingId },
        data: { status: 'APPROVED', moderatedById: adminId, moderatedAt: new Date() },
      }),
    );

    expect(moderated.count).toBe(1);
  });

  it('keeps the media library and the SEO overrides to platform staff', async () => {
    const media = await runAsTenant(prisma, { userId: adminId }, (tx) =>
      tx.media.create({
        data: {
          kind: 'IMAGE',
          url: `https://media.probe.test/${suffix}.png`,
          filename: `${suffix}.png`,
          mimeType: 'image/png',
          sizeBytes: 1024,
          folder: 'Probe',
          uploadedById: adminId,
        },
      }),
    );

    const seo = await runAsTenant(prisma, { userId: adminId }, (tx) =>
      tx.seoMeta.create({
        data: { path: `/${suffix}`, title: 'Probe', updatedById: adminId },
      }),
    );

    createdMedia.push(media.id);
    createdSeo.push(seo.id);

    // A visitor cannot enumerate them, even though the media URL would work once known — which is the
    // distinction the policy is making: knowing where a file is should be a decision, not a query.
    const [mediaForVisitor, seoForVisitor, mediaForStaff] = await Promise.all([
      runAsTenant(prisma, {}, (tx) => tx.media.count({ where: { id: media.id } })),
      runAsTenant(prisma, {}, (tx) => tx.seoMeta.count({ where: { id: seo.id } })),
      runAsTenant(prisma, { userId: staffId }, (tx) => tx.media.count({ where: { id: media.id } })),
    ]);

    expect(mediaForVisitor).toBe(0);
    expect(seoForVisitor).toBe(0);
    // A signed-in non-admin is still not platform staff.
    expect(mediaForStaff).toBe(0);

    // A visitor cannot write either — and the taxonomy exception is the contrast: categories ARE public
    // to read, which is why the policy is written per table rather than applied in one sweep.
    await expect(
      runAsTenant(prisma, {}, (tx) =>
        tx.media.create({
          data: {
            kind: 'IMAGE',
            url: 'https://media.probe.test/nope.png',
            filename: 'nope.png',
            mimeType: 'image/png',
            sizeBytes: 10,
          },
        }),
      ),
    ).rejects.toThrow();

    const categories = await runAsTenant(prisma, {}, (tx) => tx.blogCategory.count());
    expect(categories).toBeGreaterThan(0);
  });
});

