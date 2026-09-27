import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { ERROR_CODES } from '../src/common/errors/error-codes.js';
import { REQUEST_ID_HEADER } from '../src/common/http/request-id.js';
import { createTestApp } from './helpers/create-test-app.js';
import { ProbeModule } from './helpers/probe.module.js';

/**
 * The error envelope, end to end.
 *
 * `@chapfoody/api-client` branches on `code` and surfaces `requestId` to support, so
 * this shape is a contract, not an implementation detail. These tests pin it for the
 * two cases that exist in M1: a route that does not exist, and an unexpected failure.
 */
describe('error envelope (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp([ProbeModule]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('answers an unknown route with the documented envelope', async () => {
    const response = await request(app.getHttpServer()).get('/v1/does-not-exist').expect(404);

    expect(response.body).toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
      message: 'Ressource introuvable.',
      path: '/v1/does-not-exist',
    });
    expect(Number.isNaN(Date.parse(response.body.timestamp))).toBe(false);
  });

  it('ties the response to the request through requestId', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/does-not-exist')
      .set(REQUEST_ID_HEADER, 'trace-abc-123')
      .expect(404);

    expect(response.body.requestId).toBe('trace-abc-123');
    expect(response.headers[REQUEST_ID_HEADER]).toBe('trace-abc-123');
  });

  it('never leaks a stack trace or internal detail on an unexpected failure', async () => {
    const response = await request(app.getHttpServer()).get('/v1/probe/boom').expect(500);

    expect(response.body).toMatchObject({
      code: ERROR_CODES.INTERNAL_ERROR,
      message: 'Une erreur interne est survenue.',
    });

    const serialised = JSON.stringify(response.body);

    expect(serialised).not.toContain('internal detail that must never reach a client');
    expect(serialised).not.toContain('node_modules');
    // No stack frames of the form "at fn (/path/file.ts:12:34)".
    expect(serialised).not.toMatch(/at .+\(.+:\d+:\d+\)/);
    expect(response.body).not.toHaveProperty('stack');
  });

  it('returns a JSON body with the right content type', async () => {
    const response = await request(app.getHttpServer()).get('/v1/does-not-exist').expect(404);

    expect(response.headers['content-type']).toMatch(/application\/json/);
  });
});
