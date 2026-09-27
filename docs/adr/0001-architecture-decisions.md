# ADR-0001 — Architecture baseline for Chapfoody SaaS

- **Status**: Accepted
- **Date**: 2026-09-27
- **Deciders**: Chapfoody product owner + engineering
- **Resolves**: the open proposals of `guidelines/UpdateRequirements.md`, sections **E** (backend), **F** (database) and **G** (architecture)
- **Companion document**: `guidelines/ImplementationPlan.md`

## 1. Context

Chapfoody is a multi-tenant SaaS for the food ecosystem — restaurants/fast-food, bars/maquis, métiers de bouche,
épiceries & fruiteries, boutiques/supermarché, producers & distributors, catering, independent delivery drivers,
delivery companies, marketing affiliates — plus a super-admin back office and, for each client, a customisable
online selling website.

The current repository is a single **Vite + React 18 SPA** with no URL routing, no backend, simulated authentication
and 100 % hardcoded data (~82 000 lines, 138 components, 22 pages, 48 shadcn/ui primitives). The requirement document
asks for a Next.js migration, a real backend, a database, per-category dashboards, subscription-gated premium
features, a storefront generator, external marketing integrations and a super-admin dashboard, with a **TDD**
approach and **security first**.

Constraints that shaped this ADR:

1. Ten dashboards share roughly 80 % of their domain logic (orders, catalog, stock, clients, POS, accounting).
2. A POS sale must atomically write: order + order lines + stock movements + cash session + accounting journal entry
   (+ loyalty points when enabled).
3. Premium access is decided by an admin-created subscription plan and must not be bypassable from the client.
4. The team starts from a prototype: delivery speed matters, but the data model must not need a rewrite when the
   storefront and the integrations arrive.
5. The target market is francophone (Africa/Europe): currency flexibility (XOF/EUR/USD), several payment providers,
   French as the primary locale.

## 2. Decisions

| ID | Decision |
|---|---|
| **D1** | Backend framework: **NestJS 11** |
| **D2** | Database: **PostgreSQL + Prisma**, hosted on **Neon** |
| **D3** | Architecture style: **modular monolith** with two entrypoints (HTTP API + background worker) in one codebase |
| **D4** | Frontend topology: **one Next.js 15 App Router application** with route groups `(marketing) \| (auth) \| admin \| dashboard \| (storefront)` |
| **D5** | Multi-tenancy: **shared schema + `businessId` + Postgres RLS** |
| **D6** | AuthN: **self-hosted** (Argon2id, JWT access + httpOnly rotating refresh, Google OAuth, TOTP MFA) |
| **D7** | Repo tooling: **pnpm workspaces + Turborepo** |
| **D8** | i18n/currency: **next-intl** + an `Intl.NumberFormat` based currency provider |
| **D9** | Testing: **Jest + Supertest** (api), **Vitest + Testing Library** (frontend), **Playwright** (E2E) |
| **D10** | Payments: **`PaymentProvider` abstraction** — Stripe first, then CinetPay/Paystack/Flutterwave |

## 3. Rationale and rejected alternatives

### D1 — NestJS over Express

**Why**: modules and dependency injection map directly onto the bounded contexts of this product; guards and
interceptors let us enforce RBAC, tenant isolation and subscription entitlements **declaratively on every route**
instead of repeating middleware by hand; `@nestjs/swagger` generates the OpenAPI document that feeds a typed client
for the frontend, which removes DTO drift; WebSockets (live orders, KDS), `@nestjs/schedule`, BullMQ queues,
class-validator validation, typed configuration and health checks are first-class; the Jest scaffolding matches the
TDD requirement.

**Rejected — Express**: would require assembling DI, validation, OpenAPI, queues, WebSockets, configuration and test
scaffolding by hand. Acceptable for a small CRUD API, not for ten dashboards, POS, accounting and integrations.

**Rejected — Fastify with a manual structure**: a faster HTTP layer, but the same assembly problem and without the
Nest ecosystem.

### D2 — PostgreSQL + Prisma on Neon

**Why**: relational integrity is essential here (money, stock, accounting); Neon provides serverless Postgres with
**branching**, which is exactly what the per-PR ephemeral database needs in CI; Prisma provides typed queries,
migrations and a clean seeding path.

**Operational rules**: the application uses the **pooled** connection string; migrations use the **direct** URL;
`prisma migrate deploy` is the only production path, and `db push` is restricted to local development.

**Rejected — Supabase**: the repository already contains a Supabase KV stub
(`src/app/supabase/functions/server/`), but it is a key-value store, not a relational model. Adopting it would mix
auth, storage and database concerns and couple the product to a provider the requirement did not ask for.

**Rejected — Drizzle**: lighter and SQL-first, but a smaller migration/seeding ecosystem and less familiar to the team.

**Rejected — MongoDB**: the accounting, invoicing and stock domains are inherently relational and need multi-table
transactions.

### D3 — Modular monolith, not microservices

**Why**: the hot path (a POS sale) must be a single database transaction spanning orders, stock, cash, accounting and
loyalty. Microservices would force sagas or distributed transactions on the most frequent operation of the product —
real correctness risk for no benefit at the current scale. The requirement asked for a proposition and reserved
validation: this is the proposition — **a modular monolith with strict module boundaries, plus a separate worker
entrypoint**, so the genuinely different workload (integration syncs, report generation, campaign sending) scales
independently from day one without splitting the codebase.

**Module boundary rule** that makes this reversible: a module exposes a service API to other modules and never lets
another module import its repository or a Prisma model directly. Cross-module side effects go through domain events
(`order.created`, `subscription.updated`) consumed by the worker.

**Extraction path if it is ever needed**: route groups plus `features/_shared` on the frontend, and module boundaries
on the backend, mean a module — most likely `storefront` or `integrations` — can be lifted into its own deployable
without a rewrite.

**Rejected — microservices from day 1**: distributed transactions on the POS path; DevOps overhead (service mesh,
contract versioning, distributed tracing) far above the current team and traffic; duplicated shared logic (catalog,
pricing, entitlements) across services.

**Rejected — serverless functions only**: cold starts on POS/KDS, no natural home for long-lived WebSockets, and
Postgres connection management becomes a liability.

### D4 — One Next.js app with route groups

**Why**: the requirement asks, in substance, for three distinct surfaces (platform site, client dashboards, client
selling websites). Route groups provide that separation — independent layouts, independent bundles, independent
middleware behaviour — while keeping **one deployment and one CI pipeline**, which is the lighter option for a team at
prototype stage. The storefront is isolated by `middleware.ts` (tenant resolution) and by the `features/_shared`
ownership rule, so it keeps its own caching and theming without a second application.

Tradeoff accepted: a marketing release also deploys the dashboard bundle. Mitigated by route-group code splitting and
per-group Lighthouse budgets in M14.

**Rejected — three Next.js apps** (`web`, `dashboard`, `storefront`): maximum isolation of release cadence and infra
scaling, but three pipelines, three deployments, three sets of environment variables and duplicated configuration
today. This remains the accepted escape hatch if the storefront ever needs its own scaling profile.

**Rejected — keeping Vite**: no server rendering for a content/SEO-driven public site, no route-level data loading,
and the requirement explicitly asks for a Next.js migration.

### D5 — Shared-schema multi-tenancy with RLS

**Why**: hundreds of small clients, not dozens of large ones. A shared schema means one migration path and cheap
onboarding. Safety comes from layers, not from hope: `businessId` on every business-scoped table, Postgres **row level
security** driven by `app.business_id` set with `SET LOCAL` inside the request transaction, a Nest tenant guard, and
Prisma `$extends` scoping so an unscoped query cannot even be written by accident.

**Rejected — schema per tenant**: migration fan-out across hundreds of schemas and connection pressure, with no
isolation benefit that RLS does not already provide.

**Rejected — database per tenant**: economically impossible to operate at this category count.

### D6 — Self-hosted authentication

**Why**: the requirement dictates exact seeded credentials with weak passwords and role-specific dashboards, plus MFA
configured inside the application's own Settings. Self-hosting keeps the user table inside our schema, so business,
role and subscription joins stay trivial, and it removes a third party from the critical login path.

**Rejected — Auth0 / Clerk / WorkOS**: per-MAU cost and a user directory duplicated outside our database, which
complicates tenant-scoped authorization.

**Rejected — Supabase Auth**: would reintroduce the dependency rejected in D2.

### D7 — pnpm workspaces + Turborepo

**Why**: one lockfile, strict dependency resolution, cached `lint/typecheck/test/build` across `apps/*` and
`packages/*`. Required for the shared `packages/{ui,types,api-client,config}` to be practical rather than ceremonial.

### D8 — next-intl + a currency provider

**Why**: the requirement asks for **functional** language and currency selectors. `next-intl` provides message
catalogs, locale negotiation and cookie persistence; a small currency provider built on `Intl.NumberFormat` handles
XOF/EUR/USD/CAD without per-page formatting logic.

### D9 — Test stack

**Why**: Jest is Nest's default and pairs with Testcontainers for real Postgres integration tests; Vitest is the
fastest fit for the Next/React layer; Playwright proves the journeys unit tests cannot — the login click budget, the
“no full reload” rule and tenant isolation. The requirement demands a **TDD** architecture and “security first”; both
need integration and E2E layers, not only unit tests.

### D10 — Payment provider abstraction

**Why**: the target market cannot be served by one provider. An interface (`PaymentProvider`: create intent, capture,
refund, verify webhook, reconcile) with Stripe implemented first and CinetPay/Paystack/Flutterwave added behind
feature flags avoids a rewrite once the commercial decision is made.

## 4. Consequences

**Positive**

- POS, stock, cash and accounting writes stay transactional and correct.
- RBAC, tenant isolation and premium gating are enforced in one place (guards, one decorator per rule) instead of per screen.
- A single typed API contract serves the marketing site, the dashboards and the storefront.
- Per-PR Neon branches make integration tests real, not mocked.
- The storefront and the integrations can be scaled — or extracted — later without a redesign.

**Negative / accepted**

- NestJS has a learning curve: mitigated by this ADR, runbooks and a one-day onboarding target in M14.
- A single Next.js app couples release cadence across surfaces: mitigated by route-group splitting and per-group
  Lighthouse budgets.
- Prisma against Neon requires explicit connection tuning (pooled URL for runtime, `connection_limit`): documented in
  M1 and load-tested in M14.
- Shared-schema multi-tenancy makes RLS correctness critical: mitigated by mandatory tenant-isolation tests in CI and
  a penetration test in M14.

## 5. Revisit triggers

Re-open this ADR when any of the following becomes true:

1. The `storefront` or `integrations` module needs a scaling or availability profile the monolith cannot provide —
   extract it as a service (its boundary is already defined by the module rule).
2. A single tenant requires physical data separation for regulatory or contractual reasons — evaluate
   schema-per-tenant for that tenant only, not for everyone.
3. Traffic saturates a single Postgres instance — evaluate read replicas, then partitioning, before even considering
   microservices.
4. A managed auth provider removes more risk than it adds cost, or compliance requirements (SOC 2, ISO 27001) become
   contractual.
5. The single-app deployment cadence becomes a genuine bottleneck for the storefront — move to the three-app topology
   recorded in D4.

## 6. Follow-ups created by this ADR

| # | Follow-up | Owner | Milestone |
|---|---|---|---|
| 1 | Promote the Chapfoody palette to real design tokens (`--brand-primary`, `--brand-accent`, `--brand-deep`) so the storefront theme engine can override them | Frontend | M4 |
| 2 | Consolidate the two duplicated token files into one and resolve the 16px/14px conflict explicitly | Frontend | M4 |
| 3 | Implement `Feature` registry + `Entitlement` from the existing `isPremium` flags in `updatedBusinessDashboardConfigurations.ts` | Backend | M10 |
| 4 | Remove the Supabase/Hono KV stub and the unused `@jsr/supabase__supabase-js` dependency | Backend | M0 / M2 |
| 5 | Document Neon pooled vs direct connection usage in the API README and `.env.example` | Backend | M1 |

**End of ADR-0001.**



