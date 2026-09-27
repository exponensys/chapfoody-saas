/**
 * Test-only helper: a `fetch` double that needs no network and no dependency on
 * the global `Response`, plus a record of every call so the request shape can be
 * asserted.
 *
 * Excluded from the build by tsconfig (`**\/*.test-util.ts`) and linted with the
 * test rule set.
 */
export interface StubFetchResult {
  fetchImpl: typeof fetch;
  calls: { url: string; init: RequestInit }[];
}

export function stubFetch(
  init: { status?: number; body?: unknown; notJson?: boolean } = {},
): StubFetchResult {
  const status = init.status ?? 200;
  const calls: { url: string; init: RequestInit }[] = [];

  const fetchImpl = (async (url: string | URL | Request, requestInit?: RequestInit) => {
    calls.push({ url: String(url), init: requestInit ?? {} });

    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => {
        if (init.notJson) throw new SyntaxError('Unexpected token < in JSON');
        return init.body ?? null;
      },
      text: async () => (init.notJson ? '<html>502 Bad Gateway</html>' : JSON.stringify(init.body)),
    } as unknown as Response;
  }) as unknown as typeof fetch;

  return { fetchImpl, calls };
}

export const TEST_BASE_URL = 'https://api.chapfoody.test';
