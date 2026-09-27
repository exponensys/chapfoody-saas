import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

/**
 * Root layout of the single Next.js application.
 *
 * Route groups declared in M4/M7 will each bring their own nested layout:
 *   (marketing)  → shared Header + Footer, requirement A.III
 *   (auth)       → minimal chrome
 *   admin        → super-admin shell
 *   dashboard    → DashboardShell
 *   (storefront) → per-tenant themed layout
 * This root layout only holds what is truly global: the document, the language
 * and the stylesheet.
 */

export const metadata: Metadata = {
  title: {
    default: 'Chapfoody — logiciel de gestion et de vente en ligne',
    template: '%s · Chapfoody',
  },
  description:
    "Chapfoody : gestion et vente en ligne pour les restaurants, bars et maquis, métiers de bouche, épiceries et fruiteries, boutiques et supermarchés, producteurs, traiteurs, livreurs et affiliés.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // lang="fr": the product interface is French (plan section 7.1). The English
    // locale added in M4 is served through next-intl, not through this attribute.
    <html lang="fr">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
