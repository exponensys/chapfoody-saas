
> ⛔ **READ-ONLY FOLDER — do not edit, do not add features, do not "quickly fix" anything here.**
> The section “ORIGINAL PROTOTYPE README (verbatim)” at the bottom of this file is the untouched original.

# legacy/ — frozen snapshot of the Chapfoody Vite prototype

## What this is

A **byte-identical snapshot** of the original Chapfoody prototype, taken on **2026-09-27** at the start of milestone
**M0** (`guidelines/ImplementationPlan.md`).

The prototype was a single **Vite 6 + React 18 SPA** (`@figma/my-make-file`, a Figma Make export) in which:

- every page lived at `/` — there was **no URL routing**, navigation was in-memory React state;
- authentication was simulated (no API, no token, no password verification);
- 100 % of the dashboard data was hardcoded mock data.

## Why it is kept

The project is being migrated to a **pnpm + Turborepo monorepo** (NestJS API, one Next.js App Router application,
Prisma/PostgreSQL on Neon). See `guidelines/ImplementationPlan.md` and `docs/adr/0001-architecture-decisions.md`.

The prototype holds roughly **82 000 lines** of working UI across **138 components** and **22 pages**, including 48
shadcn/ui primitives and the complete visual language of the product. It is the **reference implementation** for the
migration — M4 for the public pages, M8 for the dashboards. When a migrated screen is suspected of behaving
differently, this folder answers "what did it look like and how did it behave?".

## Rules

1. **Never edit a file in `legacy/`.** Every fix belongs in the new workspace (`apps/next/`).
2. It is **excluded from lint, format, typecheck, test and build** (see `turbo.json` and `.prettierignore`) so it can
   never break the pipeline or be silently reformatted.
3. It is **not** a pnpm workspace member — it has its own `package.json` and its own dependency tree.
4. It will be **archived to a git tag and removed** once dashboard parity is reached (end of M8), as recorded in
   section 12 of the implementation plan.

## Running it standalone

> ⛔ **It cannot be installed, and this is a pre-existing defect — not a consequence of the migration.**
>
> The prototype's `package.json` contains **56 malformed dependency keys**, injected by the Figma Make export. Every
> dependency is declared twice: once correctly, and once as a version-suffixed alias:
>
> ```json
> "@emotion/react": "npm:@emotion/react@11.14.0",
> "@emotion/react@11.14.0": "npm:@emotion/react@11.14.0",   ← invalid package name
> ```
>
> npm rejects the file with `EINVALIDPACKAGENAME: name can only contain URL-friendly characters`, and an empty
> `node_modules` in the original repository confirms it was never installed. The same defect is why the prototype had no
> lockfile.
>
> **If you genuinely need to run it**, strip the 56 aliased keys first — keep only the correctly named entries — then:
>
> ```bash
> cd legacy
> npm install     # npm, not pnpm: it sits outside the workspace on purpose
> npm run dev
> ```
>
> Do that on a scratch copy, never here: `legacy/` must stay byte-identical.
>
> Its dependencies are the original Figma Make ones (Vite, MUI, Radix, Supabase/Hono stubs…). Several are deliberately
> **not** carried over to the new stack, and its dependency tree must never be shared with the monorepo.

**What `legacy/` is actually for** is being *read*: M4 needs the visual and behavioural reference of the public pages,
M8 needs it for the dashboards. Both consult the source, and neither runs it.

## Where to look

| Path | Why it matters |
|---|---|
| `src/app/routes.tsx`, `src/app/App.tsx` | The old entry point and its `ViewState` switch — there was no router |
| `src/app/pages/` | The 22 pages: landing, login, signup, contact, news, videothèque, dashboards… |
| `src/app/components/UnifiedBusinessDashboard.tsx` | The single component that rendered **all** business dashboards (1 289 lines) |
| `src/app/data/updatedBusinessDashboardConfigurations.ts` | The `ModuleConfig` / `MetricConfig` / `ActionConfig` sidebar definitions, source of the `isPremium` flags reused in M10 |
| `src/app/components/GenericSectionView.tsx` | The original "unknown section" renderer, reused as the base of the required dynamic fallback page (M7) |
| `src/styles/` | CSS tokens. Note the **duplicated token files** (`default_theme.css` vs `globals.css`, 16px vs 14px) and the **hardcoded brand colours** — debt D4/D5, fixed in M4 |
| `src/app/supabase/`, `src/app/utils/supabase/` | The Supabase/Hono key-value stub — dead code, removed in M2 |
| `src/app/architecture.md`, `src/app/dev_journal.md`, `src/app/DEMO_ACCOUNTS.md` | Original project documentation, preserved for context |

The same content is also recoverable from git: commit **`85b9daa`** (“chore: snapshot of the Vite prototype before
monorepo migration (M0)”).

---

## ORIGINAL PROTOTYPE README (verbatim)

  # Multi-Dashboard SaaS App

  This is a code bundle for Multi-Dashboard SaaS App. The original project is available at https://www.figma.com/design/g9BJzJX1dQqzOjWGVNDEka/Multi-Dashboard-SaaS-App.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  