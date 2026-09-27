import type { INestApplication } from '@nestjs/common';

import { buildOpenApiDocument } from '../src/swagger.js';
import { createTestApp } from './helpers/create-test-app.js';

/**
 * The exported contract.
 *
 * `packages/api-client` is generated from this document, so it is checked the same
 * way as any other output: if a route stops being documented, the client would
 * silently lose it.
 */
describe('OpenAPI document (e2e)', () => {
  let app: INestApplication;
  let document: ReturnType<typeof buildOpenApiDocument>;

  beforeAll(async () => {
    app = await createTestApp();
    document = buildOpenApiDocument(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('documents every route the API serves today, under its real prefixed path', () => {
    expect(Object.keys(document.paths ?? {})).toEqual(
      expect.arrayContaining(['/health', '/health/db', '/health/queue', '/v1/meta']),
    );
  });

  it('describes the platform so the generated client is self-explanatory', () => {
    expect(document.info.title).toBe('Chapfoody API');
    expect(document.info.version).toBe('1.0');
    expect(document.tags?.map((tag) => tag.name)).toEqual(expect.arrayContaining(['health', 'meta']));
  });

  it('keeps the bearer scheme that the protected routes will use from M3 onwards', () => {
    expect(document.components?.securitySchemes).toHaveProperty('access-token');
  });

  it('states the error-envelope convention, so clients do not reinvent it', () => {
    expect(document.info.description).toContain('requestId');
  });
});
