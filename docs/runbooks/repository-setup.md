# Runbook — repository setup (steps that need human credentials)

Milestone **M0** of `guidelines/ImplementationPlan.md` automates everything that can be automated. The items below
cannot be: they need accounts, DNS, or repository settings that only a human with the right access can change.

Work through them in order. Each one states **why it matters** and **how to verify** it worked.

---

## 1. Neon project and branches — M0 task 8 (requirement F.1)

**Why** — Neon is the production database (ADR-0001 §D2). Its **branching** is what makes CI honest: every pull request
can run integration tests against a real, disposable PostgreSQL instead of mocks.

**Do this**

1. Create the project on [neon.tech](https://neon.tech), in the region closest to the primary user base.
2. In the Neon console → **Connect**, tick **Pooled connection**, and copy both strings:
   - **pooled** (host contains `-pooler`) → `DATABASE_URL`
   - **direct** (no `-pooler`) → `DIRECT_URL`
3. Put them in `apps/api/.env.local` — `apps/api/.env.example` gives the exact query parameters.
4. Once Prisma exists (M2), deploy the schema from a developer machine:
   ```bash
   pnpm --filter @chapfoody/api exec prisma migrate deploy
   ```

**Why two URLs** — the pooled connection goes through PgBouncer in transaction mode, which cannot hold the
session-level locks that DDL and `prisma migrate` need. Migrating through the pooler hangs or fails; running the API
through the direct connection exhausts Neon's connection limit under serverless load. Hence
`?pgbouncer=true&connection_limit=1` on the pooled URL — documented directly in the `.env.example`.

**Verify**

```bash
pnpm --filter @chapfoody/api dev
curl -s localhost:4000/health     # { "status":"ok", … }
```

**Branches to create**

| Branch | Used by |
|---|---|
| `main` | Production |
| `staging` | Staging environment |
| `dev` | Shared local development |
| one per PR | Created and deleted automatically by CI (M1) |

---

## 2. GitHub — repository settings

**Why** — the plan assumes trunk-based development with a protected `main` and Conventional Commits (plan §7.4).

### 2.1 Create the remote and push

```bash
git remote add origin git@github.com:<org>/chapfoody-saas.git
git push -u origin main
```

### 2.2 Protect `main`

**Settings → Branches → Add branch protection rule** for `main`:

- [ ] Require a pull request before merging (at least **1** approval)
- [ ] Require status checks to pass: **`lint · typecheck · test · build`** (the `quality` job of
      `.github/workflows/ci.yml`)
- [ ] Require branches to be up to date before merging
- [ ] Require linear history (matches the Conventional Commits workflow)
- [ ] Do **not** allow force pushes or deletions

> ✅ **Verify** — open a throwaway PR with a failing test: the merge button must stay blocked.

### 2.3 Add `CODEOWNERS`

`docs/` deliberately ships **no** `.github/CODEOWNERS`: it needs real GitHub team handles, and a file naming a team
that does not exist silently protects nothing. Create it once the teams exist:

```
# .github/CODEOWNERS
*                          @<org>/engineering
/prisma/                   @<org>/data
/apps/api/src/modules/auth @<org>/security
/packages/ui/              @<org>/frontend
/guidelines/               @<org>/product
/docs/adr/                 @<org>/engineering
/legacy/                   @<org>/engineering
```

### 2.4 Dependabot

Enable **Settings → Code security → Dependabot alerts** — required by plan §7.3 rule 9.

---

## 3. Commit-msg hook

**Why** — the Conventional Commits gate (`.githooks/commit-msg`) is a **native git hook**, so `pnpm install` cannot
install it. Each clone must opt in once.

```bash
pnpm hooks:install     # → git config core.hooksPath .githooks
```

> ✅ **Verify**
> ```bash
> git commit --allow-empty -m "bad message"            # rejected, with the accepted types listed
> git commit --allow-empty -m "chore: test the hook"   # accepted
> ```

---

## 4. Local backing services

**Option A — Docker** (the plan's default):

```bash
pnpm db:up      # postgres:16 + redis:7, with healthchecks
pnpm db:down
```

**Option B — without Docker** (or in CI):

- Point `DATABASE_URL` / `DIRECT_URL` at a **Neon `dev` branch**. That is a perfectly valid local database, slower only
  by network latency.
- Run Redis natively (`redis-server`) or use a free managed instance (Upstash) and set `REDIS_URL`.

> ⚠️ **Status on the machine where M0 was executed**: Docker was **not installed**, so `docker compose up` could not be
> verified. The compose file is committed, but the Definition of Done item “docker compose up yields a working Postgres
> and Redis” remains **unverified** until someone runs it. Nothing else in M0 depends on it: no code connects to
> Postgres yet (that is M2).

---

## 5. Deployment targets (M1+)

| Surface | Target | Why |
|---|---|---|
| `apps/next` | **Vercel** | App Router, ISR and per-PR preview deployments out of the box |
| `apps/api` | **Fly.io** or **Render** | Needs a long-lived process: WebSockets for live orders and the BullMQ worker |
| Database | **Neon** | Pooled URL for the application, direct URL for migrations |
| Redis | **Upstash** | Cache, rate limiting, BullMQ queues |

Environment variables are documented in `apps/api/.env.example` and `apps/next/.env.example`. Secrets belong in the
provider's secret store — never in the repository (plan §7.3 rule 3).

---

## 6. Node version and the two pins it explains

`package.json` declares `engines.node: ">=24.0.0"` and `.nvmrc` pins **24 (LTS)**, which is what CI uses.

The machine where M0 was executed runs **Node 25.8.1** — an odd-numbered, non-LTS release. It satisfies the engines
range, but it constrains tooling, and that is the reason for two pins in this repository:

| Pin | Why |
|---|---|
| **Vitest 4**, not 5 | Vitest 5 declares `node: ^22.12 \|\| ^24 \|\| >=26` and therefore **refuses to run on Node 25**. Vitest 4 accepts `>=24`, so the same version works both locally and on CI's Node 24. |
| **TypeScript 5.9.3**, not 7.x | `typescript-eslint@8` declares `typescript: ">=4.8.4 <6.1.0"`. TypeScript 7 would break typed linting. |

To match CI exactly:

```bash
nvm install    # reads .nvmrc → Node 24
nvm use
```

Neither pin is permanent: both are recorded as revisitable when the upstream peer ranges widen.

---

## 7. pnpm build scripts

pnpm ≥ 10 **blocks install scripts by default** and fails the install when a dependency asks for one. That default is a
real security improvement — a transitive dependency cannot execute arbitrary code at install time — so the repository
allowlists rather than disables it, in `pnpm-workspace.yaml`:

```yaml
allowBuilds:
  '@tailwindcss/oxide': true   # Tailwind v4 native engine
  esbuild: true               # binary used by tsx and Vitest
  sharp: true                 # native image processing for next/image
```

`allowBuilds` is the pnpm 12 spelling; it replaced the earlier `onlyBuiltDependencies` list. To see what is still
awaiting a decision, run `pnpm config list` — it reports every pending package.

If a future install fails with `ERR_PNPM_IGNORED_BUILDS`, **read the package name before adding it**: an unexpected
package requesting a build script is exactly the supply-chain signal the default is designed to raise. Never add
`--dangerously-allow-all-builds`.

---

## Checklist

- [ ] Neon project created; pooled `DATABASE_URL` and direct `DIRECT_URL` stored in `apps/api/.env.local`
- [ ] `dev` and `staging` branches created in Neon
- [ ] Remote added and `main` pushed
- [ ] `main` protected: PR required, CI status check required, linear history, no force push
- [ ] `.github/CODEOWNERS` created with the real team handles
- [ ] Dependabot alerts enabled
- [ ] `pnpm hooks:install` run on every clone
- [ ] Docker installed, **or** `DATABASE_URL` pointed at a Neon `dev` branch
- [ ] Deployment projects created for `apps/next` and `apps/api`

