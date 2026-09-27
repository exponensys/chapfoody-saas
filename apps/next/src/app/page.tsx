import { BUSINESS_CATEGORIES, dashboardPathFor } from '@chapfoody/types';
import { cn } from '@chapfoody/ui';

/**
 * M0 placeholder home page.
 *
 * The real homepage — with the scrolling slider required by A.III bis, the
 * uniform Header/Footer, the language and currency selectors and the dynamic
 * news/vidéothèque links — is built in M4.
 *
 * This page is not decoration: it renders the ten dashboards straight from
 * `@chapfoody/types` and styles them with `cn` from `@chapfoody/ui`, which proves
 * that both workspace packages resolve correctly inside Next.js (Server
 * Component + Tailwind v4) before any real feature depends on them.
 */
export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-primary">
        Jalon M0 — socle technique
      </p>

      <h1 className="mt-3 text-4xl font-bold text-brand-deep">Chapfoody</h1>

      <p className="mt-4 max-w-2xl text-neutral-600">
        Le monorepo est en place : application Next.js, API, paquets partagés, pipeline d&apos;intégration continue et
        services locaux. La migration des pages publiques (accueil, solutions, actualités, vidéothèque, contact)
        arrive au jalon M4.
      </p>

      <h2 className="mt-12 text-lg font-semibold text-neutral-900">
        Les dix tableaux de bord prévus
      </h2>

      <p className="mt-2 text-sm text-neutral-500">
        Source unique : <code className="font-mono">@chapfoody/types</code> — routes définies au §4.4 du plan.
      </p>

      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BUSINESS_CATEGORIES.map((category) => (
          <li
            key={category}
            className={cn(
              'rounded-lg border border-neutral-200 p-4 transition-colors',
              'hover:border-brand-accent hover:bg-neutral-50',
            )}
          >
            <span className="font-medium text-neutral-900">{category}</span>
            <span className="mt-1 block font-mono text-xs text-neutral-500">
              {dashboardPathFor(category)}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
