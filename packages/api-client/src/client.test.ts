import { describe, expect, it } from 'vitest';

import { createApiClient } from './client.js';
import { TEST_BASE_URL, stubFetch } from './stub-fetch.test-util.js';

describe('buildUrl', () => {
  it('normalises a trailing slash on the base URL and a missing one on the path', () => {
    const client = createApiClient({
      baseUrl: `${TEST_BASE_URL}/`,
      fetchImpl: stubFetch().fetchImpl,
    });

    expect(client.buildUrl('/v1/orders')).toBe(`${TEST_BASE_URL}/v1/orders`);
    expect(client.buildUrl('v1/orders')).toBe(`${TEST_BASE_URL}/v1/orders`);
  });

  it('drops unset filters instead of sending empty values', () => {
    const client = createApiClient({ baseUrl: TEST_BASE_URL, fetchImpl: stubFetch().fetchImpl });

    const url = client.buildUrl('/v1/orders', {
      status: 'PENDING',
      customerId: undefined,
      cashierId: null,
      search: '',
      page: 2,
      paid: true,
    });

    expect(url).toBe(`${TEST_BASE_URL}/v1/orders?status=PENDING&page=2&paid=true`);
  });

  it('expands arrays into repeated keys', () => {
    const client = createApiClient({ baseUrl: TEST_BASE_URL, fetchImpl: stubFetch().fetchImpl });

    expect(client.buildUrl('/v1/orders', { tag: ['sur-place', 'emporter'] })).toBe(
      `${TEST_BASE_URL}/v1/orders?tag=sur-place&tag=emporter`,
    );
  });
});

describe('request', () => {
  it('attaches the bearer token and returns the parsed body', async () => {
    const { fetchImpl, calls } = stubFetch({ body: { id: 'ord_1' } });
    const client = createApiClient({
      baseUrl: TEST_BASE_URL,
      fetchImpl,
      getAccessToken: () => 'access-token',
    });

    const order = await client.get<{ id: string }>('/v1/orders/ord_1');

    expect(order).toEqual({ id: 'ord_1' });
    expect(calls[0]?.init.method).toBe('GET');
    expect(calls[0]?.init.headers).toMatchObject({
      accept: 'application/json',
      authorization: 'Bearer access-token',
    });
  });

  it('omits the token when signed out', async () => {
    const { fetchImpl, calls } = stubFetch({ body: {} });
    const client = createApiClient({
      baseUrl: TEST_BASE_URL,
      fetchImpl,
      getAccessToken: () => null,
    });

    await client.get('/v1/orders');

    expect(calls[0]?.init.headers).not.toHaveProperty('authorization');
  });

  it('omits the token on public endpoints even when authenticated', async () => {
    const { fetchImpl, calls } = stubFetch({ body: {} });
    const client = createApiClient({
      baseUrl: TEST_BASE_URL,
      fetchImpl,
      getAccessToken: () => 'access-token',
    });

    await client.get('/v1/public/plans', { auth: false });

    expect(calls[0]?.init.headers).not.toHaveProperty('authorization');
  });

  it('serialises the body and sets the content type on writes', async () => {
    const { fetchImpl, calls } = stubFetch({ status: 201, body: { id: 'ord_2' } });
    const client = createApiClient({ baseUrl: TEST_BASE_URL, fetchImpl });

    await client.post('/v1/orders', { body: { channel: 'POS', lines: [] } });

    expect(calls[0]?.init.method).toBe('POST');
    expect(calls[0]?.init.headers).toMatchObject({ 'content-type': 'application/json' });
    expect(calls[0]?.init.body).toBe(JSON.stringify({ channel: 'POS', lines: [] }));
  });

  it('returns undefined for 204 No Content', async () => {
    const { fetchImpl } = stubFetch({ status: 204 });
    const client = createApiClient({ baseUrl: TEST_BASE_URL, fetchImpl });

    await expect(client.delete('/v1/orders/ord_3')).resolves.toBeUndefined();
  });
});
