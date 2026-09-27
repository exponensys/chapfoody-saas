import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { ERROR_CODES } from '../src/common/errors/error-codes.js';
import { createTestApp } from './helpers/create-test-app.js';
import { ProbeModule } from './helpers/probe.module.js';

/**
 * The global ValidationPipe, wired on the real application.
 *
 * A unit test proves the pipe's behaviour in isolation; this one proves it is
 * actually installed. Without it, a future change that drops
 * `app.useGlobalPipes(...)` from `configureApp` would leave every unit test green
 * while validation silently stopped happening in production.
 */
describe('request validation (e2e)', () => {
  let app: INestApplication;

  const validBody = { email: 'client@chapfoody.test', quantity: 2 };

  beforeAll(async () => {
    app = await createTestApp([ProbeModule]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('accepts a valid payload and hands the handler a DTO instance', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/probe')
      .send(validBody)
      .expect(201);

    expect(response.body.received).toEqual(validBody);
  });

  it('rejects an invalid payload with VALIDATION_FAILED and per-field details', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/probe')
      .send({ email: 'pas-un-email', quantity: 0 })
      .expect(400);

    expect(response.body).toMatchObject({
      code: ERROR_CODES.VALIDATION_FAILED,
      message: 'La requête contient des données invalides.',
    });
    expect(response.body.details).toMatchObject({
      email: ['isEmail'],
      quantity: ['min'],
    });
    expect(response.body.requestId).toEqual(expect.any(String));
  });

  it('rejects unknown properties instead of ignoring them (mass-assignment guard)', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/probe')
      .send({ ...validBody, isSuperAdmin: true })
      .expect(400);

    expect(response.body.code).toBe(ERROR_CODES.VALIDATION_FAILED);
    expect(response.body.details).toMatchObject({ isSuperAdmin: ['whitelistValidation'] });
  });

  it('rejects a missing required field', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/probe')
      .send({ quantity: 2 })
      .expect(400);

    expect(response.body.details).toMatchObject({ email: ['isEmail'] });
  });
});
