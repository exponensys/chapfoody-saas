/**
 * Shared ESLint flat configuration (ESLint 10).
 *
 * Every workspace consumes it with a two-line file of its own:
 *
 *   // eslint.config.js
 *   export { default } from '@chapfoody/config/eslint';
 *
 * Rules deliberately kept lean in M0. Framework-specific plugins (React, hooks,
 * Next) are added in M4, when the React surface actually lands in the workspace,
 * so that each plugin is introduced together with the code it governs.
 *
 * NOTE ON TYPESCRIPT: this config requires TypeScript >= 5.9 and < 6.1.
 * `typescript-eslint@8` declares `typescript: ">=4.8.4 <6.1.0"`, which is why the
 * workspace pins TypeScript 5.9.3 rather than the newer 7.x line.
 */
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/*.d.ts',
      // Generated code (Prisma client, OpenAPI types…) is machine-authored: linting
      // it produces thousands of findings nobody may fix.
      '**/generated/**',
      // The frozen prototype must never be linted: it is read-only and would
      // produce thousands of findings that nobody is allowed to fix.
      'legacy/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      // Console output is tolerated for warnings and errors only; anything else
      // must go through the structured logger (plan section 7.3).
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },

  // Tests may use non-null assertions and dynamic typing freely.
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.test-util.ts',
      '**/test/**/*.ts',
    ],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // CLI entrypoints and seeds report their progress on stdout by design; that is
  // their user interface, not debug noise.
  {
    files: ['**/scripts/**/*.ts', '**/prisma/seed.ts'],
    rules: {
      'no-console': 'off',
    },
  },

  // Must stay last: switches off every rule that would fight the formatter.
  prettier,
);
