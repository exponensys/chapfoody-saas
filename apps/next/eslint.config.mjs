// `.mjs` on purpose: this package does not set `"type": "module"` (Next.js owns
// that decision), so a `.js` ESLint config would be re-parsed as ESM with a
// "Module type is not specified" warning on every lint run.
export { default } from '@chapfoody/config/eslint';
