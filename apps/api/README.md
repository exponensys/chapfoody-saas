# @chapfoody/api

The Chapfoody API and background worker — **NestJS 11, CommonJS, Prisma 7, BullMQ**.

## Status: milestone **M1** complete — the NestJS socle

M1 builds an empty but production-shaped API. No business domain yet: those arrive
per milestone (auth in M3, catalog and orders in M7/M8). What exists is the frame
everything else hangs off.

| Delivered | Detail |
|---|---|
| Typed, fail-fast configuration | `src/config/env.ts` is the **only** module reading `process.env`; an invalid value aborts boot before a single request is served |
| Structured logging | pino: one JSON line per event in production, colourised in development, request id on every record |
| Correlation ids | `x-request-id` reused when safe, generated otherwise, echoed back, carried in logs and in every error |
| Validation | global `ValidationPipe` with `whitelist` + `forbidNonWhitelisted` (extra fields are rejected, not ignored) |
| Error envelope | one shape for every failure: `{ code, message, details?, requestId, path, timestamp }` |
| Health probes | `/health` (liveness), `/health/db`, `/health/queue` (readiness) |
| Metadata | `/v1/meta`, publishing the ten supported dashboards |
| OpenAPI | served at `/docs`, exported to `packages/api-client/openapi.json` |
| Prisma | `PrismaModule` wired for Prisma 7 (driver adapter, pooled URL at runtime) |
| Queue | `QueueModule` with an optional Redis connection and a no-op consumer |
| Worker entrypoint | `src/worker.ts`, a second deployable from the same codebase |
| Tests | 21 suites — unit, HTTP contract (supertest), opt-in integration — with enforced coverage thresholds |

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/health` | Liveness: process up. Touches **no** dependency. |
| `GET` | `/health/db` | Readiness: `SELECT 1` through the pg driver adapter. |
| `GET` | `/health/queue` | Readiness: Redis round trip, or `disabled` when not configured. |
| `GET` | `/v1/meta` | Running milestone + the ten supported business categories. |
| `GET` | `/docs` | Swagger UI (enabled everywhere except production). |
| `GET` | `/docs/json` | The OpenAPI document the frontend client is generated from. |

Probes sit **outside** the versioned prefix on purpose: an orchestrator's probe path
should not change when the API version does.

```bash
curl -s localhost:4000/health
# {"status":"ok","service":"chapfoody-api","milestone":"M1","uptimeSeconds":3,"timestamp":"…"}

curl -s localhost:4000/health/db
# {"status":"not-configured","dependency":"database","latencyMs":null,"message":"DATABASE_URL n'est pas défini.","requestId":"…"}

curl -s localhost:4000/v1/nope
# {"code":"NOT_FOUND","message":"Ressource introuvable.","requestId":"…","path":"/v1/nope","timestamp":"…"}
```

## Running it

```bash
cp apps/api/.env.example apps/api/.env.local     # fill in what you need
pnpm --filter @chapfoody/api dev                 # API in watch mode, localhost:4000
pnpm --filter @chapfoody/api dev:worker          # queue consumer in watch mode
pnpm --filter @chapfoody/api build               # tsc → dist/
pnpm --filter @chapfoody/api start               # node dist/main.js
pnpm --filter @chapfoody/api start:worker        # node dist/worker.js
pnpm --filter @chapfoody/api openapi:export      # regenerate the client contract
```

**No environment is required to start.** Every variable has a sane default, and
`DATABASE_URL` is only mandatory in production. `REDIS_URL` is optional for the API —
the queue simply reports `disabled` — but **required by the worker**, which exits
non-zero without it rather than starting with nothing to consume.

## Layout

```
apps/api/
├─ prisma/
│  └─ schema.prisma         datasource + generator only; models arrive in M2
├─ prisma.config.ts         Prisma 7 CLI config: migrations path + DIRECT_URL
├─ src/
│  ├─ main.ts               HTTP entrypoint (bootstrap → configureApp → listen)
│  ├─ worker.ts             queue-consumer entrypoint (no HTTP server)
│  ├─ app.module.ts         HTTP module graph       — withProcessors: false
│  ├─ worker.module.ts      worker module graph     — withProcessors: true
│  ├─ configure-app.ts      cross-cutting wiring, SHARED with the test harness
│  ├─ swagger.ts            OpenAPI document, shared by /docs and the export script
│  ├─ app.constants.ts      service name, milestone, route prefix
│  ├─ common/
│  │  ├─ async/             withTimeout (bounded start-up checks)
│  │  ├─ errors/            error codes, AppException, response shapes
│  │  ├─ filters/           the single exit point for every failure
│  │  ├─ http/              request-id resolution + Express middleware
│  │  ├─ logging/           pino options (a pure function of the environment)
│  │  └─ pipes/             the global validation pipe
│  ├─ config/               env parsing + validation, and its injection token
│  ├─ infra/
│  │  ├─ prisma/            PrismaService (lazy client, pg adapter), module
│  │  └─ queue/             connection parsing, QueueService, consumer, module
│  ├─ modules/              feature modules: health, meta (domain modules land here)
│  ├─ scripts/              export-openapi
│  └─ generated/prisma/     Prisma 7 output — generated, git-ignored, never edited
└─ test/
   ├─ helpers/              app factory, availability probes, test-only probe module
   ├─ *.e2e-spec.ts         HTTP contract through supertest
   └─ *.integration-spec.ts opt-in: real PostgreSQL / Redis
```

## Four decisions worth knowing before you touch this package

### 1. CommonJS + `tsc`, not a bundler

NestJS dependency injection reads the `design:paramtypes` metadata that TypeScript
emits for decorated constructor parameters. That emit is TypeScript-only: bundler
transforms (**esbuild** in `tsx`, **Oxc** in Vite/Vitest) do not produce it. A Nest
app therefore cannot be run or tested through those tools, which is why the API is
compiled with `tsc`, runs on CommonJS, and is tested with Jest.

> This is also why the API is the one package pinned to Nest **11**: NestJS 12 is
> ESM-only, and its test path needs an SWC transform for that same metadata.

### 2. `configureApp` is shared with the tests

CORS, correlation ids, the validation pipe, the exception filter and the route prefix
are applied by **one** function used by `main.ts`, the OpenAPI export and the test
harness. Duplicating that wiring in tests is how "green tests, broken production"
happens.

### 3. Prisma 7 splits the connection in two places

| Where | Which URL | Used by |
|---|---|---|
| `prisma.config.ts` | `DIRECT_URL` | `prisma migrate`, `db pull`, `studio` — session-level locks and DDL cannot go through a transaction-mode pooler |
| `PrismaService` | `DATABASE_URL` (pooled) | the running API and worker, via the `PrismaPg` driver adapter |

A missing connection is a *degraded* state, not a crash: `PrismaService` builds its
client lazily, so the API boots on a fresh clone and `/health/db` reports
`not-configured`.

### 4. The queue is optional for the API and mandatory for the worker

The API must serve HTTP even when Redis is down, so `QueueModule.forRoot` registers
the queue only when `REDIS_URL` is set and `/health/queue` reports `disabled`
otherwise. The **worker** is the opposite: it refuses to start without a broker, and
probes reachability with a 5-second deadline before declaring itself healthy —
because ioredis retries forever, and a worker that silently retries is a worker that
looks healthy while doing nothing.

## The error envelope

Every failure — framework 404s included — is normalised to:

```json
{
  "code": "VALIDATION_FAILED",
  "message": "La requête contient des données invalides.",
  "details": { "email": ["isEmail"], "lines.0.quantity": ["min"] },
  "requestId": "0f1c…",
  "path": "/v1/orders",
  "timestamp": "2026-09-27T10:00:00.000Z"
}
```

- `code` is **stable and machine-readable**; `@chapfoody/api-client` branches on it.
- `details` carries **constraint names**, not messages: the API owns the reason, the
  frontend owns the wording and its translation.
- `message` is always French and user-presentable. Framework defaults are replaced —
  Express's `Cannot GET /v1/x` and Nest's English `Not Found` never reach a user.
- `requestId` matches the server log line and the `x-request-id` header.
- Unexpected failures answer with a generic message; the real error is logged only,
  so stacks, SQL and file paths cannot leak.

## Tests

```bash
pnpm --filter @chapfoody/api test                # unit + HTTP contract
pnpm --filter @chapfoody/api test:watch
pnpm --filter @chapfoody/api test:coverage       # enforces the thresholds
pnpm --filter @chapfoody/api test:integration    # opt-in, needs real services

# integration, with services from `pnpm db:up`
INTEGRATION_DATABASE_URL="postgresql://chapfoody:chapfoody@localhost:5432/chapfoody" \
INTEGRATION_REDIS_URL="redis://localhost:6379" \
  pnpm --filter @chapfoody/api test:integration
```

| Suffix | Kind | Needs |
|---|---|---|
| `*.spec.ts` | unit — pure functions, DI doubles | nothing |
| `*.e2e-spec.ts` | HTTP contract through supertest, against the **real** app | nothing |
| `*.integration-spec.ts` | real PostgreSQL and/or Redis | `INTEGRATION_*` variables |

Integration suites are **skipped, not failed**, when their variables are absent — and
the skip announces itself on stdout, so a missing service can never look like a
passing suite. CI runs them for real using Postgres and Redis service containers
(`.github/workflows/ci.yml`).

Current state: **21 suites, 136 tests passing, 2 suites skipped**, coverage
**92.4 % statements / 83.2 % branches / 96.3 % functions** (thresholds 80/70/80/80,
enforced in CI).

Two things the tests deliberately pin, because they are easy to lose in a refactor:

- the **e2e specs assert the shared `configureApp`**, so dropping the global pipe or
  filter fails the build instead of silently weakening production;
- `testMatch` lists all three filename suffixes — `**/*.spec.ts` does **not** match
  `foo.e2e-spec.ts`, and missing that skipped the whole e2e suite once already.

## What M2 brings

- The full Prisma domain schema: identity, tenancy, subscriptions, catalog, inventory,
  orders, POS, accounting, HR, delivery, affiliate, marketing, content, storefront.
- Postgres **row-level security** on every business-scoped table, plus the tenant
  scoping extension and its isolation test suite.
- Migrations and the seed: plans, the feature registry, and the eight required
  accounts (`super_admin@email.com`, `restaurant@email.com`, …).
- Integration tests that finally have a schema to exercise — the harness built here
  (`test/helpers/availability.ts` and the opt-in pattern) is what they hang off.

