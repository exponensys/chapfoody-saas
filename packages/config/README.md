# @chapfoody/config

Shared tooling configuration for the monorepo. **This package contains no runtime code** — only the configs every
other workspace extends, so there is exactly one place to change a compiler flag, a lint rule or a brand token.

## What it exports

| Subpath | File | Consumed by |
|---|---|---|
| `@chapfoody/config/eslint` | `eslint.config.js` | Every workspace (`export { default } from '@chapfoody/config/eslint';`) |
| `@chapfoody/config/prettier` | `prettier.config.js` | The repository root `prettier.config.mjs` |
| `@chapfoody/config/tailwind/preset.css` | `tailwind/preset.css` | `apps/next` |
| `@chapfoody/config/tsconfig/base.json` | `tsconfig/base.json` | All the bases below, and the repository root |
| `@chapfoody/config/tsconfig/node.json` | `tsconfig/node.json` | `apps/api`, Node scripts |
| `@chapfoody/config/tsconfig/next.json` | `tsconfig/next.json` | `apps/next` |
| `@chapfoody/config/tsconfig/library.json` | `tsconfig/library.json` | `packages/ui`, `packages/types`, `packages/api-client` |

## Package scripts

This package intentionally defines **no** `lint`, `typecheck`, `test` or `build` script: it has no source to process.
Turbo simply skips it for those tasks.

## Two constraints worth knowing

### TypeScript is pinned to 5.9.x on purpose

`typescript-eslint@8` declares `peerDependencies.typescript: ">=4.8.4 <6.1.0"`. TypeScript 7 exists upstream, but
adopting it would break typed linting. The pin lives in the root `package.json`; revisit it when `typescript-eslint`
widens its range.

### The Tailwind preset is the only place brand colours may be written

`tailwind/preset.css` is the **source of truth for the Chapfoody palette** (`--color-brand-primary` `#b70f23`,
`--color-brand-accent` `#f4b71b`, `--color-brand-deep` `#70070e`).

In the prototype these hex values were hardcoded as arbitrary Tailwind classes in hundreds of files, and the duplicated
token files disagreed on the base font size (16px vs 14px — 14px won, silently). That is technical debt **D4/D5** in
`guidelines/ImplementationPlan.md`, resolved by this file in M4. New code must use the token utilities
(`bg-brand-primary`, `text-brand-accent`, …) instead of raw hex values — the per-tenant website themes in M11 depend on
being able to override them.
