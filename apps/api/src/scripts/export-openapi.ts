import 'reflect-metadata';

import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module.js';
import { configureApp } from '../configure-app.js';
import { loadEnv } from '../config/env.js';
import { buildOpenApiDocument } from '../swagger.js';

/**
 * Writes the OpenAPI contract consumed by `@chapfoody/api-client`.
 *
 * The document is built by the same function that serves `/docs`, and the app is
 * configured by the same `configureApp` as the running server — so the exported
 * file cannot drift from what the API actually serves. Run it after a build:
 *
 *   pnpm --filter @chapfoody/api openapi:export [outputPath]
 *
 * Default output is `packages/api-client/openapi.json`, relative to this package.
 */
const DEFAULT_OUTPUT = '../../packages/api-client/openapi.json';

async function main(): Promise<void> {
  const outputPath = resolve(process.argv[2] ?? DEFAULT_OUTPUT);

  const app = await NestFactory.create(AppModule, { logger: false });

  // The prefix must be applied before the document is built, otherwise the exported
  // paths would not match what the server serves (`/v1/...`).
  configureApp(app, loadEnv(), { withSwagger: false });
  await app.init();

  const document = buildOpenApiDocument(app);
  await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');

  const pathCount = Object.keys(document.paths ?? {}).length;
  process.stdout.write(`OpenAPI document written to ${outputPath} (${pathCount} paths)\n`);

  await app.close();
}

main().catch((error: unknown) => {
  process.stderr.write(`Failed to export the OpenAPI document: ${String(error)}\n`);
  process.exitCode = 1;
});
