/**
 * Shared Prettier configuration — the single formatting truth for the monorepo.
 *
 * The options mirror the style already used by the Chapfoody prototype
 * (double quotes, semicolons, 2-space indentation) so that migrated code keeps
 * its look instead of being reformatted wholesale during the Vite → Next.js
 * migration (requirement: “keep the current design style”).
 *
 * @type {import("prettier").Config}
 */
export default {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  overrides: [
    {
      // Structured data reads better without trailing separators.
      files: ['*.json', '*.jsonc'],
      options: { trailingComma: 'none' },
    },
    {
      files: ['*.yml', '*.yaml'],
      options: { singleQuote: true },
    },
  ],
};
