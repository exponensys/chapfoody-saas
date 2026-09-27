# @chapfoody/ui

The shared UI layer of the Chapfoody platform.

## Scope (plan sections 3 and 7)

1. **shadcn/ui primitives** ported from the prototype, keeping the same look and behaviour. The prototype's 48
   primitives live in `legacy/src/app/components/ui/`.
2. **The Chapfoody design tokens** — brand colours, typography, radii — declared once in
   `@chapfoody/config/tailwind/preset.css`.
3. **The uniform Header and Footer** required by requirement A.III, mounted once in the `(marketing)` layout instead
   of being re-wired by every page.
4. **DashboardShell building blocks** shared by the ten dashboards (requirement B).

## Status: M0 skeleton

Only `cn()` exists today, so the workspace pipeline (build · typecheck · lint · test) is genuinely exercised.

| Arrives in | What |
|---|---|
| M4 | Tokens consolidated (debt D4/D5), Header, Footer, Logo, TopBar, the form/primitives needed by the public pages |
| M7 | `DashboardShell`, `DataTable`, `EmptyState`, `Skeleton`, `PremiumGate` |
| M8 | Components promoted out of individual dashboards once a second dashboard needs them |

## Usage

```ts
import { cn } from '@chapfoody/ui';

<div className={cn('rounded-lg p-4', isActive && 'bg-brand-primary text-white', className)} />
```

`cn` combines `clsx` (conditional syntax) with `tailwind-merge` (last conflicting utility wins), so a component's
default spacing can be overridden by its caller instead of producing `p-2 p-4` and leaving the result to CSS source
order.

> **Use it everywhere.** The prototype shipped a private copy of this helper in `src/app/components/ui/utils.ts`.
> The rule from M4 onwards is one implementation, imported from here — not one per dashboard.

## Rules

- **Tailwind utilities only.** No raw hex colours: use the tokens (`bg-brand-primary`, `text-brand-accent`,
  `bg-brand-deep`). Per-tenant website themes in M11 depend on being able to override those variables.
- **Accessibility is not optional.** Every dialog and sheet needs an accessible title and description — see
  `guidelines/AccessibilityChecklist.md`.
- **Responsive by default.** Mobile-first, 44 px minimum touch targets, following
  `guidelines/ResponsiveGuide.md`.
- **Shared means shared.** A change here affects several dashboards at once, so it needs a review from the owners of
  the dashboards that consume it (plan §7.4).

## Tests

```bash
pnpm --filter @chapfoody/ui test
```

React component tests (Testing Library + jsdom) start in M4, when the React surface actually lands in this package.
