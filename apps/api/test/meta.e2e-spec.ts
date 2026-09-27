import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { BUSINESS_CATEGORIES } from '@chapfoody/types';

import { CURRENT_MILESTONE, SERVICE_NAME } from '../src/app.constants.js';
import { createTestApp } from './helpers/create-test-app.js';

/**
 * Contract of `GET /v1/meta`.
 *
 * The URL itself is part of the contract: it is unchanged from the M0 placeholder,
 * so the frontends did not have to change when the API became NestJS.
 */
describe('platform metadata (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('serves /v1/meta under the versioned prefix', async () => {
    const response = await request(app.getHttpServer()).get('/v1/meta').expect(200);

    expect(response.body).toMatchObject({
      service: SERVICE_NAME,
      milestone: CURRENT_MILESTONE,
    });
  });

  it('publishes exactly the ten supported dashboards', async () => {
    const response = await request(app.getHttpServer()).get('/v1/meta').expect(200);

    expect(response.body.supportedCategories).toEqual(BUSINESS_CATEGORIES);
    expect(response.body.supportedCategories).toHaveLength(10);
  });

  it('exposes the merged grocery/fruit dashboard and the new shop dashboard', async () => {
    const response = await request(app.getHttpServer()).get('/v1/meta').expect(200);

    expect(response.body.supportedCategories).toEqual(
      expect.arrayContaining(['epiceries-fruiteries', 'boutiques-supermarche']),
    );
  });

  it('is not served without the prefix', async () => {
    await request(app.getHttpServer()).get('/meta').expect(404);
  });
});
