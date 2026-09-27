/**
 * Tailwind CSS v4 for Next.js.
 *
 * The prototype styled itself through `@tailwindcss/vite`, a Vite-only plugin
 * that cannot run inside Next.js. This file is its replacement — technical debt
 * **D3** in `guidelines/ImplementationPlan.md`, closed here in M0.
 *
 * The design tokens themselves live in the shared preset
 * (`@chapfoody/config/tailwind/preset.css`) and are imported from
 * `src/app/globals.css`, so the palette has exactly one definition.
 */
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
