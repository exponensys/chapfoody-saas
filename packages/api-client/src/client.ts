import { ApiError, readErrorBody } from './errors.js';
import type {
  ApiClient,
  ApiClientOptions,
  HttpMethod,
  QueryParams,
  RequestOptions,
} from './types.js';

/**
 * Drops unset filters and expands arrays into repeated keys, so that a caller can
 * pass a whole filter object without pre-cleaning it:
 * `{ status: undefined, tag: ['a', 'b'] }` → `?tag=a&tag=b`.
 */
function appendQuery(search: URLSearchParams, query: QueryParams | undefined): void {
  if (!query) return;

  for (const [key, value] of Object.entries(query)) {
    // Empty values are skipped rather than sent as "", so the server reads them
    // as "filter not set" instead of "filter set to empty".
    if (value === undefined || value === null || value === '') continue;

    if (Array.isArray(value)) {
      for (const item of value) search.append(key, String(item));
    } else {
      search.append(key, String(value));
    }
  }
}

/**
 * Creates the transport used by every frontend surface.
 *
 * The return value is a plain object rather than a class, so it can be spread,
 * wrapped by middleware, and unit-tested with an injected `fetch`.
 */
export function createApiClient(options: ApiClientOptions): ApiClient {
  const baseUrl = options.baseUrl.replace(/\/+$/, '');
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;

  if (typeof fetchImpl !== 'function') {
    throw new Error(
      'createApiClient: no fetch implementation available. Pass options.fetchImpl on runtimes without a global fetch.',
    );
  }

  function buildUrl(path: string, query?: QueryParams): string {
    const normalisedPath = path.startsWith('/') ? path : `/${path}`;
    const search = new URLSearchParams();
    appendQuery(search, query);

    const queryString = search.toString();
    return `${baseUrl}${normalisedPath}${queryString ? `?${queryString}` : ''}`;
  }

  async function request<T>(
    method: HttpMethod,
    path: string,
    requestOptions: RequestOptions = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      accept: 'application/json',
      ...(requestOptions.headers ?? {}),
    };

    if (requestOptions.body !== undefined) {
      headers['content-type'] = 'application/json';
    }

    if (requestOptions.auth !== false) {
      const token = options.getAccessToken?.();
      if (token) headers['authorization'] = `Bearer ${token}`;
    }

    const response = await fetchImpl(buildUrl(path, requestOptions.query), {
      method,
      headers,
      body: requestOptions.body === undefined ? undefined : JSON.stringify(requestOptions.body),
      signal: requestOptions.signal,
    });

    if (!response.ok) {
      throw new ApiError(response.status, await readErrorBody(response));
    }

    // 204 No Content / 205 Reset Content carry no body to parse.
    if (response.status === 204 || response.status === 205) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  return {
    buildUrl,
    request,
    get: <T>(path: string, requestOptions?: Omit<RequestOptions, 'body'>) =>
      request<T>('GET', path, requestOptions),
    post: <T>(path: string, requestOptions?: RequestOptions) =>
      request<T>('POST', path, requestOptions),
    put: <T>(path: string, requestOptions?: RequestOptions) =>
      request<T>('PUT', path, requestOptions),
    patch: <T>(path: string, requestOptions?: RequestOptions) =>
      request<T>('PATCH', path, requestOptions),
    delete: <T>(path: string, requestOptions?: Omit<RequestOptions, 'body'>) =>
      request<T>('DELETE', path, requestOptions),
  };
}
