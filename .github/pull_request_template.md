<!--
  Chapfoody SaaS — pull request template.
  Fills the requirement of ImplementationPlan.md section 7.4: every PR must state
  the milestone and the requirement it addresses, and list the tests it adds.
-->

## What this PR does

<!-- One paragraph. What changed and why. -->

## Traceability

| Field | Value |
|---|---|
| Milestone | <!-- e.g. M0 --> |
| Requirement id (plan section 9) | <!-- e.g. A.III, B.11, G.1 — or "n/a (chore)" --> |
| Dashboard / feature folder | <!-- e.g. features/restaurant/ — or "n/a" --> |

Closes <!-- #issue -->

## Type of change

- [ ] `feat` — new capability
- [ ] `fix` — bug fix
- [ ] `refactor` / `perf` — no behaviour change
- [ ] `chore` / `build` / `ci` — tooling, dependencies, pipeline
- [ ] `docs` — documentation only
- [ ] Breaking change (describe the migration below)

## Checklist

- [ ] **TDD** — tests were written first and are included in this PR (plan §7.2)
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes
- [ ] `pnpm build` passes
- [ ] No hardcoded business data, no mock left behind (requirement B.1)
- [ ] Tenant scoping applied on every query touched (`businessId` / RLS)
- [ ] Premium features gated **server-side** with `@RequiresFeature()` (requirement B.13)
- [ ] No secret, token or credential added to the client bundle
- [ ] Prisma schema changes ship with their migration **and** a rollback note (plan §7.4)
- [ ] `guidelines/ImplementationPlan.md` §9 status updated if a requirement moved
- [ ] Accessibility: dialogs/sheets have an accessible title and description (`AccessibilityChecklist.md`)
- [ ] Responsive checked on mobile (320 px) and desktop

## UI changes

<!-- Screenshots or a short recording. "Before / After" is ideal. -->

## How to test

<!-- Exact steps for a reviewer: URL, account, actions, expected result. -->

## Notes for reviewers

<!-- Trade-offs, follow-up work, anything deliberately deferred to a later milestone. -->
