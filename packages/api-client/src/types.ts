/**
 * Public types of the Chapfoody API client.
 *
 * Kept separate from the implementation so that consumers (dashboards,
 * storefront, platform site) can `import type` without pulling in any runtime
 * code.
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** A single query-string value. Arrays become repeated keys (`?tag=a&tag=b`). */
export type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly (string | number)[];

export type QueryParams = Record<string, QueryValue>;

export interface RequestOptions {
  /** JSON body. Serialised automatically; omit it for GET and DELETE. */
  body?: unknown;
  query?: QueryParams;
  headers?: Record<string, string>;
  /** Set to `false` for public endpoints, to omit the Authorization header. */
  auth?: boolean;
  signal?: AbortSignal;
}

export interface ApiClientOptions {
  /** Base URL of the API, with or without a trailing slash. */
  baseUrl: string;
  /** Returns the current access token, or a falsy value when signed out. */
  getAccessToken?: () => string | null | undefined;
  /** Injectable for tests; defaults to the global `fetch`. */
  fetchImpl?: typeof fetch;
}

export interface ApiClient {
  /** Absolute URL the client would call for a given path and query. */
  buildUrl(path: string, query?: QueryParams): string;
  request<T>(method: HttpMethod, path: string, options?: RequestOptions): Promise<T>;
  get<T>(path: string, options?: Omit<RequestOptions, 'body'>): Promise<T>;
  post<T>(path: string, options?: RequestOptions): Promise<T>;
  put<T>(path: string, options?: RequestOptions): Promise<T>;
  patch<T>(path: string, options?: RequestOptions): Promise<T>;
  delete<T>(path: string, options?: Omit<RequestOptions, 'body'>): Promise<T>;
}
