# @chapfoody/api

The Chapfoody API and background worker.

> ⚠️ **M0 placeholder.** This is a deliberately minimal Node HTTP server, not the real API. It exists so that
> `pnpm dev` genuinely starts an API and so the workspace pipeline runs against real code. **M1 replaces it with the
> NestJS socle.** The two endpoints below survive that replacement because they are useful in production.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/health` | Liveness probe: status, service, milestone, uptime, timestamp |
| `GET` | `/v1/meta` | Authoritative list of supported business categories, published for the frontends |

```bash
curl http://localhost:4000/health
# { "status":"ok", "service":"chapfoody-api", "milestone":"M0", "uptimeSeconds":3, "timestamp":"…" }

curl http://localhost:4000/v1/meta
# { "service":"chapfoody-api", "milestone":"M0", "supportedCategories":[…10 slugs…] }
```

Unknown routes answer `404` with the error envelope the frontend client already parses
(`packages/api-client/src/errors.ts`): `{ code, message }`.

## Running it

```bash
cp apps/api/.env.example apps/api/.env.local     # then fill in the values
pnpm --filter @chapfoody/api dev                 # tsx watch, http://localhost:4000
```

No environment at all is needed to start: `NODE_ENV`, `PORT`, `DATABASE_URL` and `REDIS_URL` all default sensibly, and
`DATABASE_URL` is only **required** in production. That is asserted by `src/env.test.ts`, so a fresh clone always
boots.

## Layout

| File | Responsibility |
|---|---|
| `src/env.ts` | The **only** place `process.env` is read. Validates eagerly and returns a typed `ApiEnv` |
| `src/health.ts` | Pure payload builders for `/health` and `/v1/meta` (time and uptime are injectable, so tests are deterministic) |
| `src/index.ts` | Bootstrap: HTTP server, routing, graceful shutdown on `SIGINT`/`SIGTERM` |
| `.env.example` | The environment contract, including the pooled-vs-direct Neon distinction |

## Why it is shaped like this

- **`process.env` is read once.** A malformed variable fails at boot with an actionable message instead of surfacing as
  `undefined` deep inside a request.
- **Payload builders are pure.** Asserting an exact JSON payload must not race the clock.
- **Graceful shutdown exists from day one.** `SIGTERM` during a deploy must not drop an in-flight request.
- **`@chapfoody/types` is a real dependency**, used by `/v1/meta`. This proves the workspace build graph works
  (Turbo builds `@chapfoody/types` before this app) with a use that is genuinely needed rather than a demonstration.

## What M1 brings

Typed `ConfigModule` (same fail-fast behaviour), `PrismaModule` with the pooled/direct split, global `ValidationPipe`,
the exception filter that emits `{ code, message, details?, requestId? }`, audit interceptor, `@nestjs/swagger` OpenAPI
at `/docs`, BullMQ worker entrypoint (`src/worker.ts`), and Jest + Supertest + Testcontainers for integration tests
against an ephemeral Neon branch.

## Tests

```bash
pnpm --filter @chapfoody/api test
```

`env.test.ts` covers defaults, trimming, boundary ports and the production database requirement; `health.test.ts`
covers the payload contracts, including the assertion that `/v1/meta` publishes exactly the ten categories defined in
`@chapfoody/types`.
