# @chapfoody/api-client

The single way the Chapfoody frontends talk to the API. Framework-agnostic, dependency-free and testable without a
network: `fetch` is injected.

## Usage

```ts
import { createApiClient, ApiError } from '@chapfoody/api-client';

const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  getAccessToken: () => session?.accessToken,
});

const orders = await api.get<Order[]>('/v1/orders', {
  query: { status: 'PENDING', page: 1 },
});

try {
  await api.post('/v1/marketing/campaigns', { body: { name: 'Black Friday' } });
} catch (error) {
  // Typed refusals are what make the upgrade call to action possible (B.13).
  if (error instanceof ApiError && error.isFeatureNotInSubscription) {
    showUpgradeDialog();
  }
}
```

## What it guarantees

| Concern | Behaviour |
|---|---|
| URL building | Base URL and path are normalised, so a trailing slash never produces `//` |
| Query strings | Unset values (`undefined`, `null`, `""`) are dropped instead of sent as empty filters; arrays become repeated keys (`?tag=a&tag=b`) |
| Auth | `Authorization: Bearer <token>` is added when a token exists; skip it with `{ auth: false }` for public endpoints |
| Bodies | JSON is serialised automatically and `content-type` is set |
| Empty responses | `204` / `205` resolve to `undefined` rather than throwing on an empty body |
| Errors | Non-2xx throws `ApiError` carrying the API's stable `code`, `message`, `details` and `requestId` |

## Contract with the API

The error envelope is fixed by the M1 global exception filter:

```json
{ "code": "FEATURE_NOT_IN_SUBSCRIPTION", "message": "…", "details": {}, "requestId": "req_123" }
```

`ApiError` exposes convenience predicates so callers do not hardcode strings:

- `isFeatureNotInSubscription` — the subscription gate refused the call (requirement B.13)
- `isUnauthenticated` — session missing or expired → redirect to `/login`
- `isForbidden` — authenticated but not allowed (wrong role, or another tenant's resource)

## Deliberately not here yet

The typed endpoint layer (one method per domain resource) and the TanStack Query hooks are added in **M7**, generated
from the OpenAPI document that the NestJS API exposes in **M1**. This package stays the transport underneath them.

## Tests

```bash
pnpm --filter @chapfoody/api-client test
```

Every case runs against a local `fetch` stub — no network, no global `Response` dependency, no module mocking.
