/**
 * @chapfoody/api-client — the single way the Chapfoody frontends talk to the API.
 *
 * Constraints (plan section 2, ADR-0001):
 *   - `fetch` is injectable, so every test runs without network and without
 *     module-system mocking.
 *   - Errors follow the API's global exception filter (M1), giving the frontend a
 *     typed `code` instead of a message to parse.
 *   - No framework dependency: the typed endpoint layer and the TanStack Query
 *     hooks are built on top of this transport in M7.
 */

export { createApiClient } from './client.js';
export { ApiError, readErrorBody, type ApiErrorBody } from './errors.js';
export type {
  ApiClient,
  ApiClientOptions,
  HttpMethod,
  QueryParams,
  QueryValue,
  RequestOptions,
} from './types.js';
