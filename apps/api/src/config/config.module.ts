import { Global, Module } from '@nestjs/common';

import { type ApiEnv, loadEnv } from './env.js';
import { API_ENV } from './env.token.js';

/**
 * Global configuration module.
 *
 * `useFactory` runs while the application is being built, so an invalid
 * environment throws during bootstrap — before the HTTP server accepts a single
 * request. That is the whole point: fail fast, fail loudly, fail once.
 *
 * Modules inject the `API_ENV` token (exported from `env.token.ts`) instead of
 * reading `process.env` or looking values up by string, so a typo is a compile
 * error and a missing variable is a boot error.
 */
@Global()
@Module({
  providers: [
    {
      provide: API_ENV,
      useFactory: (): ApiEnv => loadEnv(),
    },
  ],
  exports: [API_ENV],
})
export class ConfigModule {}
