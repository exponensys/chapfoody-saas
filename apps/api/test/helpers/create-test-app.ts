import { type INestApplication, type ModuleMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../src/app.module.js';
import { configureApp } from '../../src/configure-app.js';
import { loadEnv } from '../../src/config/env.js';

/** The import list of a Nest module — `ModuleMetadata['imports']` minus `undefined`. */
type ModuleImports = NonNullable<ModuleMetadata['imports']>;

/**
 * Builds the real application for HTTP contract tests.
 *
 * It uses `AppModule` **and** the production `configureApp`, so the global pipe,
 * exception filter, correlation ids, CORS and route prefix under test are literally
 * the ones that ship. Only the logger is disabled, because log output is not the
 * behaviour under test.
 *
 * Extra modules can be injected — used by the validation spec to mount a probe
 * controller with a DTO, since M1 has no DTO-bearing endpoint of its own yet.
 */
export async function createTestApp(extraImports: ModuleImports = []): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule, ...extraImports],
  }).compile();

  const app = moduleRef.createNestApplication({ logger: false });

  configureApp(app, loadEnv(), { withSwagger: false });

  await app.init();

  return app;
}
