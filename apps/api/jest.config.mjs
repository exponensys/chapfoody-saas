/**
 * Jest configuration for the API.
 *
 * Jest (with ts-jest) is the API's test runner because NestJS needs TypeScript's
 * `emitDecoratorMetadata`, which ts-jest inherits from tsc. The frontends use
 * Vitest — see docs/adr/0001-architecture-decisions.md and the API README.
 *
 * `.mjs` because this package is intentionally CommonJS: a `.js` config would be
 * parsed as CommonJS while the shared ESLint config expects module syntax.
 *
 * Test kinds, by file name:
 *   *.spec.ts              unit tests, no external service required
 *   *.e2e-spec.ts          HTTP contract tests through supertest (app in-memory)
 *   *.integration-spec.ts  need PostgreSQL and/or Redis; skipped with an
 *                          explanatory message when they are not configured
 *
 * @type {import('jest').Config}
 */
export default {
  rootDir: '.',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  // All three suffixes must be listed explicitly: `**/*.spec.ts` does NOT match
  // `foo.e2e-spec.ts`, because the separator before "spec" is a hyphen, not a dot.
  // Missing that silently skips the whole e2e suite — which is exactly what the
  // coverage table caught.
  testMatch: ['**/*.spec.ts', '**/*.e2e-spec.ts', '**/*.integration-spec.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  // Application code imports its own modules with a `.js` extension, because that is
  // what Node resolves at runtime once tsc has emitted CommonJS. Jest's resolver
  // does not map `.js` back to the TypeScript source, so the extension is stripped
  // here — including for the generated Prisma client, which lives under src/.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  clearMocks: true,
  restoreMocks: true,

  collectCoverageFrom: [
    'src/**/*.ts',
    // Machine-generated code is not ours to cover.
    '!src/generated/**',
    // Bootstraps and wiring have no logic worth measuring.
    '!src/main.ts',
    '!src/worker.ts',
    '!src/app.module.ts',
    '!src/worker.module.ts',
    '!src/**/*.module.ts',
    '!src/scripts/**',
    '!src/**/index.ts',
  ],
  // Thresholds from the implementation plan (§7.2), enforced in CI through the
  // `test:coverage` task.
  coverageThreshold: {
    global: { statements: 80, branches: 70, functions: 80, lines: 80 },
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'lcov'],
};
