# @chapfoody/next

The Chapfoody platform frontend — **one Next.js App Router application** serving every web surface (ADR-0001, decision
D4).

> ⚠️ **M0 placeholder.** Only a temporary home page exists, plus the toolchain. The Vite prototype is being migrated
> here route by route in **M4** (public site) and **M7/M8** (dashboards).

## Route groups (created in M4 / M7)

| Group | Purpose | Layout |
|---|---|---|
| `(marketing)` | Homepage, solutions, use cases, actualités, vidéothèque, contact, support | Shared Header + Footer mounted **once** (requirement A.III) |
| `(auth)` | Login, register, MFA, reset, verify, onboarding, OAuth callback | Minimal chrome |
| `admin` | Super-admin at `/admin/login` (MFA mandatory) | Dedicated admin shell |
| `dashboard` | The ten client dashboards, `/dashboard/<category>/…` | `DashboardShell` (no full reload — requirement B.6) |
| `(storefront)` | Per-tenant selling websites, `<tenant>.chapfoody.com` | Per-tenant themed layout |

## What M0 already wires up

- **Tailwind CSS v4 through PostCSS** (`postcss.config.mjs`), replacing the Vite-only `@tailwindcss/vite` plugin —
  technical debt **D3** closed.
- **A single source of design tokens**: `src/app/globals.css` imports
  `@chapfoody/config/tailwind/preset.css`, where the Chapfoody palette is declared. Debt **D4/D5** is completed in M4
  when the two duplicated legacy token files and the hardcoded hex values are removed.
- **Workspace packages resolve inside Next**: `@chapfoody/types` (categories and dashboard routes) and
  `@chapfoody/ui` (`cn`) are used by the placeholder page, which is what makes the build graph real rather than
  theoretical.
- **Tests**: Vitest with jsdom, Testing Library, jest-dom matchers and the `@/*` alias mirrored in
  `vitest.config.ts`. `tsconfig` keeps `jsx: "preserve"` for Next, so the JSX transform is overridden for tests only.

## Commands

```bash
cp apps/next/.env.example apps/next/.env.local
pnpm --filter @chapfoody/next dev        # http://localhost:3000
pnpm --filter @chapfoody/next build
pnpm --filter @chapfoody/next test
```

## Conventions

- **French in the UI**, English in code, paths and documentation.
- **Server Components by default.** Add `"use client"` only for interactivity (`motion/react`, `recharts`, Radix,
  carousels). The prototype was a client-only SPA; here the public pages must stay server-rendered for SEO and
  performance.
- **One route per page** (requirement A.II). A feature without an implemented page still has a route and renders the
  dynamic fallback page — never a 404.
- **No hardcoded business data.** Everything dashboard-related comes from the API through `@chapfoody/api-client`.
- **Metrics and DB rows are not components.** Data fetching happens in Server Components or through the typed client;
  components receive props.
