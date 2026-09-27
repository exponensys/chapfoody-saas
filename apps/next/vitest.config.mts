import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * `.mts` on purpose: this package does not set `"type": "module"` (Next.js owns
 * that decision), so a `.ts` config would be loaded as CommonJS and Vite warns
 * that ESM syntax there is unsupported by its future native config loader. The
 * .mts extension is unambiguously ESM and removes the warning.
 */
export default defineConfig({
  // JSX is handled by the official React plugin rather than by an esbuild override.
  // Vite 8 is Rolldown/Oxc based — its `esbuild` option no longer drives the JSX
  // transform — and this package's tsconfig keeps `jsx: "preserve"` because Next
  // owns the emit step. The plugin resolves both facts, so tests compile TSX
  // correctly without weakening the tsconfig Next depends on.
  plugins: [react()],

  resolve: {
    // Mirrors the `@/*` alias declared in tsconfig.json.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
