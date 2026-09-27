import { afterEach, describe, expect, it, vi } from 'vitest';

import { createApiClient } from './client.js';
import { ApiError, readErrorBody } from './errors.js';
import { TEST_BASE_URL, stubFetch } from './stub-fetch.test-util.js';

describe('error handling', () => {
  it('throws a typed ApiError from the API error envelope', async () => {
    const { fetchImpl } = stubFetch({
      status: 403,
      body: {
        code: 'FEATURE_NOT_IN_SUBSCRIPTION',
        message: 'Le marketing avancé est inclus dans le plan Premium.',
        requestId: 'req_123',
      },
    });
    const client = createApiClient({ baseUrl: TEST_BASE_URL, fetchImpl });

    const error = (await client
      .get('/v1/marketing/campaigns')
      .catch((caught: unknown) => caught)) as ApiError;

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(403);
    expect(error.code).toBe('FEATURE_NOT_IN_SUBSCRIPTION');
    expect(error.requestId).toBe('req_123');
    // The point of the typed code: the UI can branch on it (requirement B.13).
    expect(error.isFeatureNotInSubscription).toBe(true);
    expect(error.isForbidden).toBe(true);
  });

  it('flags unauthenticated responses so the app can redirect to /login', async () => {
    const { fetchImpl } = stubFetch({
      status: 401,
      body: { code: 'UNAUTHENTICATED', message: 'nope' },
    });
    const client = createApiClient({ baseUrl: TEST_BASE_URL, fetchImpl });

    const error = (await client.get('/v1/me').catch((caught: unknown) => caught)) as ApiError;

    expect(error.isUnauthenticated).toBe(true);
    expect(error.isFeatureNotInSubscription).toBe(false);
  });

  it('falls back to a generic error when the response is not JSON', async () => {
    const { fetchImpl } = stubFetch({ status: 502, notJson: true });
    const client = createApiClient({ baseUrl: TEST_BASE_URL, fetchImpl });

    const error = (await client.get('/v1/orders').catch((caught: unknown) => caught)) as ApiError;

    expect(error.code).toBe('UNKNOWN_ERROR');
    expect(error.message).toBe('Request failed with status 502');
  });

  it('readErrorBody ignores a JSON body without a usable message', async () => {
    const response = {
      status: 500,
      json: async () => ({ unexpected: true }),
    } as unknown as Response;

    await expect(readErrorBody(response)).resolves.toEqual({
      code: 'UNKNOWN_ERROR',
      message: 'Request failed with status 500',
    });
  });

  it('keeps details so server-side validation errors can be displayed per field', async () => {
    const { fetchImpl } = stubFetch({
      status: 422,
      body: {
        code: 'VALIDATION_FAILED',
        message: 'Validation échouée',
        details: { email: ['Adresse e-mail invalide'] },
      },
    });
    const client = createApiClient({ baseUrl: TEST_BASE_URL, fetchImpl });

    const error = (await client.post('/v1/auth/register').catch((caught: unknown) => caught)) as ApiError;

    expect(error.details).toEqual({ email: ['Adresse e-mail invalide'] });
  });
});

describe('createApiClient guard', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fails loudly when no fetch implementation exists at all', () => {
    vi.stubGlobal('fetch', undefined);

    expect(() => createApiClient({ baseUrl: TEST_BASE_URL })).toThrow(
      /no fetch implementation available/i,
    );
  });
});
