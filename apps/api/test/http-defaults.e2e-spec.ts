import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { REQUEST_ID_HEADER } from '../src/common/http/request-id.js';
import { createTestApp } from './helpers/create-test-app.js';

/**
 * Cross-cutting HTTP defaults.
 *
 * Small decisions that are easy to lose in a refactor and awkward to notice in
 * production, so they are pinned here.
 */
describe('HTTP defaults (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('does not advertise the framework through x-powered-by', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);

    expect(response.headers).not.toHaveProperty('x-powered-by');
  });

  it('answers JSON, so a client can always parse the body', async () => {
    const response = await request(app.getHttpServer()).get('/v1/meta').expect(200);

    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  it('sets CORS headers for an allowed origin, with credentials for the refresh cookie', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/meta')
      .set('origin', 'http://localhost:3000')
      .expect(200);

    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  it('always returns the correlation id, so a client can quote it to support', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);

    expect(response.headers[REQUEST_ID_HEADER]).toEqual(expect.any(String));
  });
});
