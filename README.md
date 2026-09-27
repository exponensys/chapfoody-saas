# Chapfoody SaaS

Monorepo for the **Chapfoody** platform — management and online-selling software for the food ecosystem:
restaurants & fast-food, bars/maquis, métiers de bouche, épiceries & fruiteries, boutiques/supermarché, producers &
distributors, catering, independent delivery drivers, delivery companies and marketing affiliates — plus a super-admin
back office and a customisable selling website for every client.

## Status: milestone **M0** — foundations

The original Vite prototype has been **frozen into `legacy/`** (read-only, byte-identical) and the monorepo skeleton now
exists: workspaces, shared tooling configuration, CI, local backing services, environment contract and placeholder
applications.

Nothing of the old product has been deleted — the prototype remains fully recoverable, both in `legacy/` and in git
commit `85b9daa`.

### Roadmap

| | Milestone | Scope |
|---|---|---|
| ✅ | **M0** | Monorepo, CI, `legacy/` freeze, foundations |
| ▶️ | M1 | NestJS socle: config, Prisma, health, OpenAPI, test harness |
| | M2 | Prisma schema, RLS multi-tenancy, seed (8 required accounts) |
| | M3 | Auth, Google OAuth, TOTP MFA, RBAC + tenant + entitlement guards |
| | M4 | Vite → Next.js migration of the public site, header/footer, i18n, scrolling slider |
| | M5–M6 | Dynamic news/vidéothèque · login & register UX |
| | M7–M10 | Dashboard shell · 10 category dashboards · menus & vendors · premium gating |
| | M11–M13 | Client selling websites (mini-Shopify) · Zoho/Zapier/Make/Google Agenda · super-admin |
| | M14–M15+ | Hardening, performance, QA · continuous optimisation |

Full detail, acceptance criteria and the requirement traceability matrix: **`guidelines/ImplementationPlan.md`**.
Architecture decisions and their rejected alternatives: **`docs/adr/0001-architecture-decisions.md`**.

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | **24 LTS** (`.nvmrc`) | `engines` accepts `>=24.0.0`; Node 25 also works locally |
| pnpm | **12.6.0** (pinned via `packageManager`) | `npm install -g pnpm` |
| Docker | optional | Only for local Postgres/Redis — a Neon `dev` branch works just as well |
| PostgreSQL | Neon | Serverless Postgres, one branch per PR in CI |
| Redis | optional locally | Cache, rate limiting and BullMQ queues |

## Quick start

```bash
pnpm install                 # install the whole workspace
cp apps/api/.env.example apps/api/.env.local       # then fill in the values
cp apps/next/.env.example apps/next/.env.local
pnpm hooks:install           # enable the Conventional Commits hook
pnpm db:up                   # optional: local Postgres + Redis (needs Docker)
pnpm dev                     # start every app in watch mode
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Runs every app in watch mode (Turbo, persistent tasks) |
| `pnpm build` | Builds every workspace in dependency order |
| `pnpm lint` | ESLint across the workspace |
| `pnpm typecheck` | `tsc --noEmit` across the workspace |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm test:coverage` | Unit tests with coverage |
| `pnpm format` / `pnpm format:check` | Prettier write / verify |
| `pnpm clean` | Removes build output across the workspace |
| `pnpm db:up` / `pnpm db:down` | Local Postgres + Redis via Docker Compose |
| `pnpm hooks:install` | Points git at `.githooks` (Conventional Commits gate) |

Turbo caches every task: re-running `pnpm test` without changes is nearly instant.

## Repository layout

```
chapfoody-saas/
├─ apps/
│  ├─ api/          NestJS API + BullMQ worker        (M1 — currently a health-check placeholder)
│  └─ next/         Next.js: marketing | auth | admin | dashboard | storefront   (M4 — currently a placeholder page)
├─ packages/
│  ├─ config/       TypeScript bases, ESLint, Prettier, Tailwind preset   ← single source of tooling truth
│  ├─ ui/           shadcn/ui primitives, design tokens, Header/Footer/DashboardShell
│  ├─ types/        Domain types and zod schemas shared by API and frontends
│  └─ api-client/   Typed client + TanStack Query hooks
├─ prisma/          Schema, migrations, seed                (M2)
├─ docs/            ADRs, runbooks, ERD
├─ guidelines/      Implementation plan and project guidelines
├─ legacy/          ⛔ frozen Vite prototype — read-only, never edited (see its README)
└─ .githooks/       Commit-msg convention gate
```

### Boundaries (enforced in review)

1. A dashboard never imports from another dashboard — shared code goes to `features/_shared` or `packages/ui`.
2. Anything used by two or more dashboards is promoted to `_shared` in the same PR that introduces the second use.
3. Backend modules expose a service API; no module reaches into another module's repository or Prisma models.
4. `legacy/` is read-only and excluded from lint, format, test and build.
5. The server is the only source of truth for permissions, entitlements and tenant scope — client checks are UX only.

## Conventions

- **Language**: French in the user interface, English in code, paths, commits and documentation.
- **Commits**: Conventional Commits, enforced by `.githooks/commit-msg`
  (`feat(orders): add live order sound alerts`). Enable it once per clone with `pnpm hooks:install`.
- **Tests**: TDD — no feature code is merged without a test that first failed and then passed (plan §7.2).
- **Security**: validation at the boundary, audit on every write, least privilege, no secret in the client bundle
  (plan §7.3).
- **Design**: the current Chapfoody visual language is preserved (`#b70f23`, `#f4b71b`, `#70070e`); the brand palette
  becomes real design tokens in M4 (`packages/config/tailwind/preset.css`) so client websites can be themed per tenant.

## Documentation

| Document | Contents |
|---|---|
| `guidelines/ImplementationPlan.md` | The plan: audit, decisions, routes, domain model, milestones M0–M15, conventions, CI/CD, traceability, risks |
| `docs/adr/0001-architecture-decisions.md` | Why NestJS, Prisma/Neon, a modular monolith and a single Next.js app |
| `docs/runbooks/repository-setup.md` | The manual steps that need human credentials (Neon, branch protection, CODEOWNERS, Docker) |
| `legacy/README.md` | What the frozen prototype is, and what is worth reading in it |
| `guidelines/AccessibilityChecklist.md` | Dialog and sheet accessibility rules |
| `guidelines/ResponsiveGuide.md`, `ResponsiveConversions.md` | Responsive patterns and what is still to convert |

