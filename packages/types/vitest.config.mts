import { defineConfig } from 'vitest/config';

// `.mts` because this package is intentionally CommonJS (see the README), so a
// `.ts` config would be loaded as CJS and Vite would warn about ESM syntax.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
