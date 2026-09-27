/**
 * Prettier configuration for the whole monorepo.
 *
 * The single source of truth lives in `@chapfoody/config` so every workspace
 * formats identically; this file only re-exports it so that editors and CLI
 * invocations resolving from the repository root find it.
 *
 * @see packages/config/prettier.config.js
 * @type {import("prettier").Config}
 */
import config from '@chapfoody/config/prettier';

export default config;
