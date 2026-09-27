# @chapfoody/types

Domain vocabulary shared by the API and every frontend surface. **Types and constants only** — no runtime logic beyond
two trivial helpers, so it stays safe to import from a Server Component, a client component, the NestJS API or a
script.

## Why it exists

The prototype defined its business categories in three incompatible places and shipped two dashboards that were
byte-for-byte duplicates (`epiceries` and `boutiques-superettes`), because nothing said where the truth lived. This
package is that place.

It is the single source of truth for:

- **which dashboards exist** — ten, per `guidelines/ImplementationPlan.md` §4.4
- **the category merge** of requirement **B.8** (épiceries + fruiteries)
- **the new dashboard** of requirement **B.9** (boutiques / supérettes / supermarché)
- **the dashboard route map** of requirement **B.5** (one route per dashboard)
- **the role vocabulary** used by RBAC in M3

## API

```ts
import {
  BUSINESS_CATEGORIES,   // readonly tuple of all 10 slugs
  CLIENT_CATEGORIES,     // the 7 “Clients” categories (requirement A.VI)
  PARTNER_CATEGORIES,    // livreur · societe-livraison · affilie
  dashboardPathFor,      // 'catering' → '/dashboard/catering'
  isBusinessCategory,    // type guard for values coming from a URL or the API
  isClientCategory,
  isPartnerCategory,
  type BusinessCategory,
  type UserRole,
} from '@chapfoody/types';
```

`dashboardPathFor` is backed by an explicit `Record<BusinessCategory, string>`, not string interpolation, so moving a
dashboard route becomes a deliberate change the compiler enforces across every consumer.

## Consumers

| Consumer | Why |
|---|---|
| Onboarding wizard (M6) | Presents the real category list, so it can never drift from the dashboards |
| `nav-config.ts` per dashboard (M7) | `dashboardPathFor` supplies the base route |
| Super-admin plan builder (M10) | Plans are scoped per category |
| `apps/api` | `/v1/meta` publishes the authoritative category list to the frontends |

## Constraints

- **No dependency on React, NestJS or any framework.** Everything must stay importable from a Server Component and
  from Node.
- **Exported from `dist`**, built with `tsc` (`pnpm --filter @chapfoody/types build`). Turbo builds it before anything
  that depends on it.
- **Adding a category is a product decision**, not a refactor: it implies a dashboard, a route, a sidebar
  configuration and a plan-scoping entry.

## Tests

```bash
pnpm --filter @chapfoody/types test
```
