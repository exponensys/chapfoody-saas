/**
 * Demo content for the PLATFORM's public site: the blog, the vidéothèque, case studies, use cases.
 *
 * ── This seed runs in a different context from every other one ────────────────
 * The tenant seeds run inside `runAsTenant({ businessId, userId })`. This one runs with a USER and no
 * business, because the content it writes belongs to the platform rather than to a tenant — and
 * because the policies require it: `media`, `seo_meta` and the write path for everything else are
 * admin-only, and `cf_is_platform_admin()` is only true for the super-admin account. Seeding with any
 * other context would be refused by the database, which is the intended behaviour rather than an
 * inconvenience.
 *
 * ── The draft and the future post are deliberate ──────────────────────────────
 * Two of the articles are DRAFT and one is SCHEDULED for tomorrow. That is what makes the publication
 * policies observable: a visitor reading this database sees two posts, not five, and the scheduled one
 * becomes visible when its moment passes rather than when a job remembers to run.
 */

import type { TenantTransaction } from '../../src/infra/prisma/tenant-context.js';

export interface ContentCounters {
  categories: number;
  tags: number;
  posts: number;
  collections: number;
  videos: number;
  caseStudies: number;
  useCases: number;
  media: number;
  pages: number;
  seoMetas: number;
}

const CATEGORIES = [
  { slug: 'restauration', name: 'Restauration', description: 'Tout pour la salle et la cuisine.', sortOrder: 0 },
  { slug: 'commerce', name: 'Commerce', description: 'Boutiques, épiceries et commerces de proximité.', sortOrder: 1 },
  { slug: 'gestion', name: 'Gestion', description: 'Comptabilité, paie et pilotage.', sortOrder: 2 },
] as const;

const TAGS = [
  { slug: 'tva', name: 'TVA' },
  { slug: 'stock', name: 'Stock' },
  { slug: 'caisse', name: 'Caisse' },
  { slug: 'livraison', name: 'Livraison' },
] as const;

/** Days from now: negative is the past, positive the future. */
const days = (n: number): Date => new Date(Date.now() + n * 24 * 60 * 60_000);

const POSTS = [
  {
    slug: 'tenir-sa-caisse-sans-ecart',
    title: 'Tenir sa caisse sans écart, tous les soirs',
    category: 'restauration',
    excerpt: "L'écart de caisse n'est pas une fatalité : c'est presque toujours une question de méthode.",
    summary: 'La méthode en trois gestes : compter, expliquer, comparer.',
    tags: ['caisse', 'gestion'],
    status: 'PUBLISHED' as const,
    publishedAt: days(-21),
    featured: true,
    minutes: 6,
    views: 412,
  },
  {
    slug: 'tva-restauration-ce-qui-change',
    title: 'TVA en restauration : ce qui change cette année',
    category: 'gestion',
    excerpt: 'Les taux, les produits concernés, et les erreurs qui coûtent le plus cher.',
    summary: 'Un tour complet des taux appliqués produit par produit.',
    tags: ['tva'],
    status: 'PUBLISHED' as const,
    publishedAt: days(-8),
    featured: false,
    minutes: 9,
    views: 188,
  },
  {
    slug: 'inventaire-sans-fermer',
    title: 'Faire son inventaire sans fermer boutique',
    category: 'commerce',
    excerpt: 'Un inventaire tournant, en trente minutes par semaine.',
    summary: 'Comment compter sans immobiliser la salle.',
    tags: ['stock'],
    status: 'SCHEDULED' as const,
    // Tomorrow: visible to an admin, invisible to a visitor until then.
    scheduledFor: days(1),
    featured: false,
    minutes: 5,
    views: 0,
  },
  {
    slug: 'brouillon-livraison-propre',
    title: 'Livraison : préparer sa zone avant de se lancer',
    category: 'commerce',
    excerpt: 'Brouillon en cours de rédaction.',
    summary: null,
    tags: ['livraison'],
    status: 'DRAFT' as const,
    featured: false,
    minutes: 4,
    views: 0,
  },
] as const;

const VIDEOS = [
  {
    slug: 'prise-en-main-caisse',
    title: 'Prendre en main la caisse en 5 minutes',
    description: "De l'ouverture de session au premier ticket.",
    provider: 'YOUTUBE' as const,
    externalId: 'dQw4w9WgXcQ',
    status: 'PUBLISHED' as const,
    publishedAt: days(-30),
    duration: 312,
    views: 1240,
  },
  {
    slug: 'importer-son-catalogue',
    title: 'Importer son catalogue depuis un tableur',
    description: 'La méthode recommandée pour reprendre un existant.',
    provider: 'VIMEO' as const,
    externalId: '76979871',
    status: 'PUBLISHED' as const,
    publishedAt: days(-15),
    duration: 480,
    views: 356,
  },
  {
    slug: 'brouillon-cloture-mensuelle',
    title: 'Clôture mensuelle, pas à pas',
    description: 'Montage en cours.',
    provider: 'SELF_HOSTED' as const,
    url: 'https://media.chapfoody.test/videos/cloture-mensuelle.mp4',
    status: 'DRAFT' as const,
    duration: null,
    views: 0,
  },
] as const;

/** Writes the demo content. Guarded on the natural keys, so a re-run changes nothing. */
export async function seedContent(
  tx: TenantTransaction,
  adminId: string,
): Promise<ContentCounters> {
  const counters: ContentCounters = {
    categories: 0,
    tags: 0,
    posts: 0,
    collections: 0,
    videos: 0,
    caseStudies: 0,
    useCases: 0,
    media: 0,
    pages: 0,
    seoMetas: 0,
  };

  // ── Taxonomy ───────────────────────────────────────────────────────────────
  const categoryIds = new Map<string, string>();

  for (const plan of CATEGORIES) {
    const existing = await tx.blogCategory.findFirst({
      where: { slug: plan.slug },
      select: { id: true },
    });

    const row =
      existing ??
      (await tx.blogCategory.create({
        data: { slug: plan.slug, name: plan.name, description: plan.description, sortOrder: plan.sortOrder },
        select: { id: true },
      }));

    if (existing === null) {
      counters.categories += 1;
    }

    categoryIds.set(plan.slug, row.id);
  }

  const tagIds = new Map<string, string>();

  for (const plan of TAGS) {
    const existing = await tx.blogTag.findFirst({
      where: { slug: plan.slug },
      select: { id: true },
    });

    const row =
      existing ??
      (await tx.blogTag.create({
        data: { slug: plan.slug, name: plan.name },
        select: { id: true },
      }));

    if (existing === null) {
      counters.tags += 1;
    }

    tagIds.set(plan.slug, row.id);
  }

  // ── Articles ───────────────────────────────────────────────────────────────
  for (const plan of POSTS) {
    const existing = await tx.blogPost.findFirst({
      where: { slug: plan.slug },
      select: { id: true },
    });

    if (existing !== null) {
      continue;
    }

    await tx.blogPost.create({
      data: {
        slug: plan.slug,
        title: plan.title,
        excerpt: plan.excerpt,
        body: `## ${plan.title}\n\n${plan.summary ?? plan.excerpt}\n\nLe reste de l'article, en markdown.`,
        categoryId: categoryIds.get(plan.category) ?? null,
        authorId: adminId,
        status: plan.status,
        // A CHECK requires the matching date for whichever state this is.
        publishedAt: plan.status === 'PUBLISHED' ? (plan.publishedAt ?? null) : null,
        scheduledFor: plan.status === 'SCHEDULED' ? ((plan as { scheduledFor?: Date }).scheduledFor ?? null) : null,
        readingMinutes: plan.minutes,
        viewCount: plan.views,
        isFeatured: plan.featured,
        locale: 'fr',
        seoTitle: plan.title,
        seoDescription: plan.excerpt,
        // The join is explicit, so the tags are created as rows rather than left implicit.
        tags: {
          create: plan.tags
            .map((slug) => tagIds.get(slug))
            .filter((id): id is string => id !== undefined)
            .map((tagId) => ({ tagId })),
        },
      },
    });

    counters.posts += 1;
  }

  return finishContent(tx, adminId, counters);
}


/** The vidéothèque, the case studies, the use cases, the media library and the legal pages. */
async function finishContent(
  tx: TenantTransaction,
  adminId: string,
  counters: ContentCounters,
): Promise<ContentCounters> {
  // ── The vidéothèque ────────────────────────────────────────────────────────
  const existingCollection = await tx.videoCollection.findFirst({
    where: { slug: 'les-bases' },
    select: { id: true },
  });

  const collection =
    existingCollection ??
    (await tx.videoCollection.create({
      data: {
        slug: 'les-bases',
        title: 'Les bases',
        description: 'Prendre en main Chapfoody, écran par écran.',
        sortOrder: 0,
      },
      select: { id: true },
    }));

  if (existingCollection === null) {
    counters.collections += 1;
  }

  for (const plan of VIDEOS) {
    const existing = await tx.video.findFirst({
      where: { slug: plan.slug },
      select: { id: true },
    });

    if (existing !== null) {
      continue;
    }

    await tx.video.create({
      data: {
        collectionId: collection.id,
        slug: plan.slug,
        title: plan.title,
        description: plan.description,
        provider: plan.provider,
        // A CHECK enforces exactly one of these, according to the provider.
        externalId: plan.provider === 'SELF_HOSTED' ? null : plan.externalId,
        url: plan.provider === 'SELF_HOSTED' ? (plan as { url?: string }).url ?? null : null,
        status: plan.status,
        publishedAt: plan.status === 'PUBLISHED' ? days(-15) : null,
        durationSeconds: plan.duration,
        viewCount: plan.views,
      },
    });

    counters.videos += 1;
  }

  // ── A case study, told with numbers ────────────────────────────────────────
  const existingCase = await tx.caseStudy.findFirst({
    where: { slug: 'boulangerie-diop' },
    select: { id: true },
  });

  if (existingCase === null) {
    await tx.caseStudy.create({
      data: {
        slug: 'boulangerie-diop',
        title: 'Boulangerie Diop : 30 % de commandes en plus en six mois',
        businessName: 'Boulangerie Diop',
        industry: 'Boulangerie',
        summary: 'Un site vitrine, une caisse, et un seul endroit pour les commandes.',
        body: '## Le point de départ\n\nTout se prenait au téléphone, sur un carnet.',
        results: { ordersGrowthPct: 30, months: 6, hoursSavedPerWeek: 11 },
        status: 'PUBLISHED',
        publishedAt: days(-12),
        isFeatured: true,
      },
    });
    counters.caseStudies += 1;
  }

  // ── Use cases ──────────────────────────────────────────────────────────────
  const USE_CASES = [
    {
      slug: 'encaisser-plus-vite',
      title: 'Encaisser plus vite aux heures de pointe',
      summary: 'Une caisse qui suit le rythme du comptoir.',
      icon: 'zap',
    },
    {
      slug: 'savoir-ce-qui-se-vend',
      title: 'Savoir ce qui se vend, et ce qui dort en stock',
      summary: 'Des mouvements de stock qui expliquent les écarts.',
      icon: 'chart',
    },
    {
      slug: 'payer-ses-equipes-sans-erreur',
      title: 'Payer ses équipes sans erreur',
      summary: 'Contrats, pointages et bulletins au même endroit.',
      icon: 'users',
    },
  ] as const;

  for (const [index, plan] of USE_CASES.entries()) {
    const existing = await tx.useCase.findFirst({
      where: { slug: plan.slug },
      select: { id: true },
    });

    if (existing !== null) {
      continue;
    }

    await tx.useCase.create({
      data: {
        slug: plan.slug,
        title: plan.title,
        summary: plan.summary,
        icon: plan.icon,
        status: 'PUBLISHED',
        publishedAt: days(-20 + index),
        sortOrder: index,
      },
    });
    counters.useCases += 1;
  }

  return finishContentTwo(tx, adminId, counters);
}


/** The media library, the legal pages and two SEO overrides. */
async function finishContentTwo(
  tx: TenantTransaction,
  adminId: string,
  counters: ContentCounters,
): Promise<ContentCounters> {
  // ── Media ──────────────────────────────────────────────────────────────────
  const MEDIA = [
    { filename: 'blog-caisse.png', kind: 'IMAGE' as const, width: 1200, height: 630, folder: 'Blog' },
    { filename: 'videotheque-cover.jpg', kind: 'IMAGE' as const, width: 1920, height: 1080, folder: 'Vidéothèque' },
  ];

  for (const plan of MEDIA) {
    const existing = await tx.media.findFirst({
      where: { filename: plan.filename },
      select: { id: true },
    });

    if (existing !== null) {
      continue;
    }

    await tx.media.create({
      data: {
        kind: plan.kind,
        url: `https://media.chapfoody.test/${plan.folder.toLowerCase()}/${plan.filename}`,
        filename: plan.filename,
        mimeType: 'image/png',
        sizeBytes: 184_320,
        width: plan.width,
        height: plan.height,
        altText: plan.filename.replace(/[-.]/g, ' '),
        folder: plan.folder,
        checksum: `demo-${plan.filename}`,
        uploadedById: adminId,
      },
    });
    counters.media += 1;
  }

  // ── The legal pages ────────────────────────────────────────────────────────
  // `isSystem` because a sign-up form that links to a 404 is a compliance problem rather than a
  // broken link: these may be edited and archived, never deleted.
  const PAGES = [
    { slug: 'mentions-legales', title: 'Mentions légales', templateKey: 'legal', isSystem: true },
    { slug: 'confidentialite', title: 'Politique de confidentialité', templateKey: 'legal', isSystem: true },
    { slug: 'tarifs', title: 'Tarifs', templateKey: 'pricing', isSystem: false },
  ];

  for (const plan of PAGES) {
    const existing = await tx.page.findFirst({
      where: { slug: plan.slug },
      select: { id: true },
    });

    if (existing !== null) {
      continue;
    }

    await tx.page.create({
      data: {
        slug: plan.slug,
        title: plan.title,
        body: `# ${plan.title}\n\nÀ compléter par l'équipe juridique.`,
        status: 'PUBLISHED',
        publishedAt: days(-60),
        templateKey: plan.templateKey,
        isSystem: plan.isSystem,
        seoTitle: plan.title,
      },
    });
    counters.pages += 1;
  }

  // ── SEO overrides ──────────────────────────────────────────────────────────
  // Keyed on the PATH, not on a polymorphic entity reference: a path is what an editor thinks in, what
  // a search engine resolves, and what a unique index can actually enforce.
  const SEO = [
    { path: '/', title: 'Chapfoody — la caisse et le site de votre commerce', noIndex: false },
    { path: '/tarifs', title: 'Tarifs Chapfoody', noIndex: false },
  ];

  for (const plan of SEO) {
    const existing = await tx.seoMeta.findFirst({
      where: { path: plan.path },
      select: { id: true },
    });

    if (existing !== null) {
      continue;
    }

    await tx.seoMeta.create({
      data: {
        path: plan.path,
        title: plan.title,
        description: plan.title,
        keywords: 'caisse, restauration, commerce, gestion',
        ogType: 'website',
        noIndex: plan.noIndex,
        structuredData: { '@context': 'https://schema.org', '@type': 'Organization', name: 'Chapfoody' },
        updatedById: adminId,
      },
    });
    counters.seoMetas += 1;
  }

  return counters;
}

