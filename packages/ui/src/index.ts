/**
 * @chapfoody/ui — the shared UI layer of the Chapfoody platform.
 *
 * Scope (plan sections 3 and 7):
 *   - shadcn/ui primitives ported from the prototype, kept identical in look
 *   - the Chapfoody design tokens (see @chapfoody/config/tailwind/preset.css)
 *   - the uniform Header and Footer required by requirement A.III
 *   - the DashboardShell building blocks shared by the ten dashboards
 *
 * Status: M0 skeleton. The primitives and layout components arrive in M4 (public
 * pages) and M7 (dashboard shell). Only `cn` exists today so that the workspace
 * pipeline — build, typecheck, lint, test — is genuinely exercised end to end.
 *
 * Owned by: this package is shared by several dashboards, so changes here need a
 * review from the owners of every dashboard that consumes them (plan §7.4).
 */

export { cn } from './lib/cn.js';
