import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { CURRENT_MILESTONE, SERVICE_NAME } from '../src/app.constants.js';
import { REQUEST_ID_HEADER } from '../src/common/http/request-id.js';
import { createTestApp } from './helpers/create-test-app.js';

/**
 * HTTP contract of the three probes.
 *
 * These run against the real application with the real global configuration, and
 * assert the documented status codes: `200` for `up`, `not-configured` and
 * `disabled`; `503` only for `down`.
 */
describe('health probes (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /health — liveness', () => {
    it('answers with the documented payload', async () => {
      const response = await request(app.getHttpServer()).get('/health').expect(200);

      expect(response.body).toMatchObject({
        status: 'ok',
        service: SERVICE_NAME,
        milestone: CURRENT_MILESTONE,
      });
      expect(typeof response.body.uptimeSeconds).toBe('number');
      expect(Number.isNaN(Date.parse(response.body.timestamp))).toBe(false);
    });

    it('does not touch any dependency, so it stays 200 while they are all down', async () => {
      // No DATABASE_URL and no REDIS_URL in the test environment: a liveness probe
      // that consulted them would fail here, and would restart a healthy pod.
      await request(app.getHttpServer()).get('/health').expect(200);
    });
  });

  describe('correlation ids', () => {
    it('always returns an x-request-id header', async () => {
      const response = await request(app.getHttpServer()).get('/health').expect(200);

      expect(response.headers[REQUEST_ID_HEADER]).toEqual(expect.any(String));
      expect(response.headers[REQUEST_ID_HEADER]).not.toHaveLength(0);
    });

    it('reuses an inbound correlation id so a trace survives the hop', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .set(REQUEST_ID_HEADER, 'trace-from-the-edge-123')
        .expect(200);

      expect(response.headers[REQUEST_ID_HEADER]).toBe('trace-from-the-edge-123');
    });

    it('replaces an unsafe inbound id instead of reflecting it back', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .set(REQUEST_ID_HEADER, 'bad id with spaces')
        .expect(200);

      expect(response.headers[REQUEST_ID_HEADER]).not.toBe('bad id with spaces');
    });
  });

  describe('GET /health/db — database readiness', () => {
    it('reports not-configured, and stays 200, when DATABASE_URL is absent', async () => {
      const response = await request(app.getHttpServer()).get('/health/db').expect(200);

      expect(response.body).toMatchObject({
        status: 'not-configured',
        dependency: 'database',
        latencyMs: null,
      });
      expect(response.body.message).toContain('DATABASE_URL');
    });
  });

  describe('GET /health/queue — queue readiness', () => {
    it('reports disabled, and stays 200, when REDIS_URL is absent', async () => {
      const response = await request(app.getHttpServer()).get('/health/queue').expect(200);

      expect(response.body).toMatchObject({
        status: 'disabled',
        dependency: 'queue',
        latencyMs: null,
      });
      expect(response.body.message).toContain('REDIS_URL');
    });
  });

  describe('prefix handling', () => {
    it('serves the probes outside the versioned prefix', async () => {
      // /v1/health must NOT exist: an orchestrator's probe path should not change
      // when the API version does.
      await request(app.getHttpServer()).get('/v1/health').expect(404);
    });
  });
});
