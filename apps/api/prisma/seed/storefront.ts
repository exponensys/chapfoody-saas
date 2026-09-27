/**
 * Demo storefront: identity, a resolved theme, pages, navigation, a domain, an asset, checkout rules.
 *
 * ── Themes are two things, and the seed writes both ──────────────────────────
 * `seedThemePresets` writes the PLATFORM catalogue (three designs every tenant may pick from) and runs
 * once, outside any tenant. `seedStorefront` writes the tenant's RESOLVED copy, which records both the
 * preset chosen and the tokens that came out of it. Storing only the resolved tokens would lose which
 * preset to re-apply when it is improved; storing only the preset would lose the overrides.
 *
 * ── The domain is ACTIVE, not PENDING, on purpose ────────────────────────────
 * A PENDING domain cannot be PRIMARY — a CHECK refuses it, because pointing the canonical URL at
 * something that does not resolve is how a working site ends up offline. Seeding the demo with an
 * ACTIVE primary domain therefore exercises both the constraint and the state a real tenant ends up in.
 */

import type { PrismaClient } from '../../src/generated/prisma/client.js';
import type { TenantTransaction } from '../../src/infra/prisma/tenant-context.js';

export interface StorefrontCounters {
  configs: number;
  themes: number;
  pages: number;
  navigation: number;
  domains: number;
  assets: number;
  checkouts: number;
}

interface ThemePreset {
  key: string;
  name: string;
  description: string;
  sortOrder: number;
  tokens: Record<string, string>;
}

/** The platform's theme catalogue. Tokens are a bag of design decisions, which is why they are JSON. */
const PRESETS: readonly ThemePreset[] = [
  {
    key: 'classic',
    name: 'Classique',
    description: 'Sobre et institutionnel. Convient aux restaurants et aux commerces de proximité.',
    sortOrder: 0,
    tokens: {
      primary: '#b70f23',
      secondary: '#f4b71b',
      accent: '#70070e',
      background: '#ffffff',
      foreground: '#1a1a1a',
      radius: '0.5rem',
      fontHeading: 'Inter',
      fontBody: 'Inter',
    },
  },
  {
    key: 'bistro',
    name: 'Bistro',
    description: 'Chaleureux, à dominante crème et brun. Pensé pour la salle.',
    sortOrder: 1,
    tokens: {
      primary: '#7c4a21',
      secondary: '#e8d5b7',
      accent: '#3f2a14',
      background: '#fffaf3',
      foreground: '#2b2118',
      radius: '0.25rem',
      fontHeading: 'Playfair Display',
      fontBody: 'Source Sans 3',
    },
  },
  {
    key: 'street',
    name: 'Street food',
    description: 'Contrasté et vif, pour la vente à emporter et les food trucks.',
    sortOrder: 2,
    tokens: {
      primary: '#111827',
      secondary: '#facc15',
      accent: '#ef4444',
      background: '#ffffff',
      foreground: '#0f172a',
      radius: '1rem',
      fontHeading: 'Archivo',
      fontBody: 'Archivo',
    },
  },
];

/** The one the demo tenant uses, and the colour it overrides. */
const DEMO_PRESET_KEY = 'classic';

/**
 * Writes the platform's theme catalogue. Not tenant-scoped: this runs once, before any tenant.
 *
 * An upsert rather than a create-if-missing, because a preset that is improved should reach existing
 * tenants on the next seed — the overrides they made live in `website_theme`, so updating the preset
 * cannot clobber a choice.
 */
export async function seedThemePresets(prisma: PrismaClient): Promise<number> {
  for (const preset of PRESETS) {
    await prisma.theme.upsert({
      where: { key: preset.key },
      create: {
        key: preset.key,
        name: preset.name,
        description: preset.description,
        sortOrder: preset.sortOrder,
        tokens: preset.tokens,
      },
      update: {
        name: preset.name,
        description: preset.description,
        sortOrder: preset.sortOrder,
        tokens: preset.tokens,
      },
    });
  }

  return PRESETS.length;
}

/** The tenant's own storefront. Every child is guarded on its natural key, so re-runs change nothing. */
export async function seedStorefront(
  tx: TenantTransaction,
  businessId: string,
  slug: string,
  businessName: string,
  userId: string,
): Promise<StorefrontCounters> {
  const counters: StorefrontCounters = {
    configs: 0,
    themes: 0,
    pages: 0,
    navigation: 0,
    domains: 0,
    assets: 0,
    checkouts: 0,
  };

  const hostname = `demo-${slug}.chapfoody.test`;

  // ── Identity ───────────────────────────────────────────────────────────────
  const existingConfig = await tx.websiteConfig.findFirst({
    where: { businessId },
    select: { id: true },
  });

  if (existingConfig === null) {
    await tx.websiteConfig.create({
      data: {
        businessId,
        siteName: businessName,
        tagline: 'Commandez en ligne, retrait ou livraison.',
        description: `Le site de ${businessName}, propulsé par Chapfoody.`,
        isPublished: true,
        // A published site must say when — a CHECK refuses the other case.
        publishedAt: new Date(),
        orderingEnabled: true,
        socials: { instagram: `@${slug}`, facebook: slug },
      },
    });
    counters.configs += 1;
  }

  // ── The resolved theme ─────────────────────────────────────────────────────
  const preset = await tx.theme.findFirst({
    where: { key: DEMO_PRESET_KEY },
    select: { id: true, tokens: true },
  });

  const existingTheme = await tx.websiteTheme.findFirst({
    where: { businessId },
    select: { id: true },
  });

  if (existingTheme === null) {
    // The preset's tokens, with the tenant's own primary colour on top. This is the whole point of the
    // split: the demo overrides one token and inherits the other seven.
    const tokens = {
      ...((preset?.tokens as Record<string, string> | null) ?? {}),
      primary: '#0f5132',
    };

    await tx.websiteTheme.create({
      data: {
        businessId,
        themeId: preset?.id ?? null,
        tokens,
        // Kept apart from `tokens` so "reset to the theme" is possible without guessing which values
        // came from where.
        overrides: { primary: '#0f5132' },
        updatedById: userId,
      },
    });
    counters.themes += 1;
  }

  // ── Pages ──────────────────────────────────────────────────────────────────
  // One HOME (a partial unique index allows only one), plus a menu and a contact page.
  const pagePlans = [
    {
      slug: 'accueil',
      title: 'Accueil',
      type: 'HOME' as const,
      sections: [
        { block: 'hero', title: businessName, subtitle: 'Ouvert du mardi au dimanche' },
        { block: 'menuGrid', limit: 6 },
        { block: 'openingHours' },
      ],
    },
    {
      slug: 'menu',
      title: 'Notre carte',
      type: 'MENU' as const,
      sections: [{ block: 'menuGrid', limit: 24 }],
    },
    {
      slug: 'contact',
      title: 'Nous contacter',
      type: 'CONTACT' as const,
      body: 'Écrivez-nous, ou passez nous voir.',
    },
  ];

  const pageIds = new Map<string, string>();

  for (const plan of pagePlans) {
    const existing = await tx.websitePage.findFirst({
      where: { businessId, slug: plan.slug },
      select: { id: true },
    });

    const page =
      existing ??
      (await tx.websitePage.create({
        data: {
          businessId,
          slug: plan.slug,
          title: plan.title,
          type: plan.type,
          sections: plan.sections ?? undefined,
          body: plan.body ?? null,
          isPublished: true,
          publishedAt: new Date(),
          sortOrder: pagePlans.findIndex((p) => p.slug === plan.slug),
        },
        select: { id: true },
      }));

    if (existing === null) {
      counters.pages += 1;
    }

    pageIds.set(plan.slug, page.id);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────
  // Each entry points at a page OR a URL, never both and never neither — a CHECK enforces it.
  const navPlans = [
    { location: 'HEADER' as const, slug: 'accueil', label: 'Accueil', url: null },
    { location: 'HEADER' as const, slug: 'menu', label: 'Carte', url: null },
    { location: 'HEADER' as const, slug: 'contact', label: 'Contact', url: null },
    {
      location: 'FOOTER' as const,
      slug: null,
      label: 'Mentions légales',
      url: '/mentions-legales',
    },
  ];

  for (const [index, plan] of navPlans.entries()) {
    const pageId = plan.slug === null ? null : (pageIds.get(plan.slug) ?? null);

    const existing = await tx.websiteNavigation.findFirst({
      where: { businessId, location: plan.location, label: plan.label },
      select: { id: true },
    });

    if (existing !== null) {
      continue;
    }

    await tx.websiteNavigation.create({
      data: {
        businessId,
        location: plan.location,
        pageId,
        url: plan.url,
        label: plan.label,
        sortOrder: index,
      },
    });
    counters.navigation += 1;
  }

  return finishStorefront(tx, businessId, hostname, userId, counters);
}


/** Domain, one asset and the checkout rules — the parts that are read when an order is placed. */
async function finishStorefront(
  tx: TenantTransaction,
  businessId: string,
  hostname: string,
  userId: string,
  counters: StorefrontCounters,
): Promise<StorefrontCounters> {
  // ── The domain ─────────────────────────────────────────────────────────────
  // ACTIVE and PRIMARY together, because a CHECK refuses a primary domain that is not active. The
  // hostname must be lower-case and contain no scheme: both are constraints, not conventions.
  const existingDomain = await tx.websiteDomain.findFirst({
    where: { businessId, hostname },
    select: { id: true },
  });

  if (existingDomain === null) {
    await tx.websiteDomain.create({
      data: {
        businessId,
        hostname,
        isPrimary: true,
        status: 'ACTIVE',
        verifiedAt: new Date(),
        sslIssuedAt: new Date(),
        lastCheckedAt: new Date(),
        verificationToken: `demo-verify-${businessId.slice(-8)}`,
        dnsRecords: [{ type: 'CNAME', name: hostname, value: 'sites.chapfoody.app' }],
      },
    });
    counters.domains += 1;
  }

  // ── An uploaded asset ──────────────────────────────────────────────────────
  const existingAsset = await tx.websiteAsset.findFirst({
    where: { businessId, filename: 'logo.png' },
    select: { id: true },
  });

  if (existingAsset === null) {
    await tx.websiteAsset.create({
      data: {
        businessId,
        kind: 'IMAGE',
        url: `https://assets.chapfoody.test/${businessId}/logo.png`,
        filename: 'logo.png',
        mimeType: 'image/png',
        sizeBytes: 24_576,
        // Dimensions come in pairs, as coordinates do.
        width: 512,
        height: 512,
        altText: 'Logo',
        folder: 'Identité',
        checksum: 'demo-checksum-not-a-real-hash',
        uploadedById: userId,
      },
    });
    counters.assets += 1;
  }

  // ── The checkout rules ─────────────────────────────────────────────────────
  const existingCheckout = await tx.checkoutSetting.findFirst({
    where: { businessId },
    select: { id: true },
  });

  if (existingCheckout === null) {
    await tx.checkoutSetting.create({
      data: {
        businessId,
        allowGuestCheckout: true,
        requirePhone: true,
        requireEmail: false,
        pickupEnabled: true,
        deliveryEnabled: true,
        // Under this the fee structure stops making sense, so the site says no rather than taking the
        // order and refusing it by telephone.
        minimumOrderAmount: '15.00',
        maximumOrderAmount: '500.00',
        leadTimeMinutes: 25,
        orderCutoffTime: '21:30',
        acceptingOrders: true,
        taxInclusivePricing: true,
        tipsEnabled: true,
        tipPresets: [5, 10, 15],
        acceptedPaymentMethods: ['CARD', 'CASH', 'MOBILE_MONEY'],
        termsUrl: '/mentions-legales',
        privacyUrl: '/confidentialite',
        updatedById: userId,
      },
    });
    counters.checkouts += 1;
  }

  return counters;
}

