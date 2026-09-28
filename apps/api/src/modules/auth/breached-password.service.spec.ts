import { Logger } from '@nestjs/common';

import { BreachedPasswordService, parseRangeBody, toRangeKey } from './breached-password.service.js';

/**
 * The breached-password check.
 *
 * The assertions worth making are about the two properties that make this safe to depend on: the password
 * never leaves (k-anonymity), and an outage at the third party never stops a registration (fail open).
 * Both are easy to "improve" into something worse — sending the whole hash, or refusing when the lookup
 * fails — so they are pinned here.
 */
describe('toRangeKey', () => {
  it('sends five characters and keeps the rest', () => {
    // The full SHA-1 of "password" — a well-known value, which is the point of a corpus.
    const { prefix, suffix } = toRangeKey('password');

    expect(prefix).toBe('5BAA6');
    expect(suffix).toBe('1E4C9B93F3F0682250B6CF8331B7EE68FD8');
    // 5 sent, 35 held back: the server cannot reconstruct the hash from what it receives.
    expect(prefix).toHaveLength(5);
    expect(suffix).toHaveLength(35);
  });

  it('is upper-case hex, because lower-case asks for a range that does not exist', () => {
    // The corpus is upper-case; a lower-case request is valid and silently returns nothing.
    expect(toRangeKey('hunter2').prefix).toMatch(/^[0-9A-F]{5}$/);
  });
});

describe('parseRangeBody', () => {
  const suffix = 'AA1E4C9B93F3F0682250B6CF8331B7EE68FD8';

  it('reports a match when the suffix is listed with a non-zero count', () => {
    expect(parseRangeBody(`0000000000000000000000000000000000A:5\n${suffix}:3303003`, suffix)).toBe(
      true,
    );
  });

  it('does NOT treat a padded entry as a match', () => {
    // `Add-Padding` entries exist to hide the real response size and carry a count of 0. Reporting them
    // as breached would flag random passwords — the kind of false positive that gets a check disabled.
    expect(parseRangeBody(`${suffix}:0`, suffix)).toBe(false);
  });

  it('returns false for an empty or malformed body rather than throwing', () => {
    for (const body of ['', 'no-colon-here', 'A1B2C3:not-a-number']) {
      expect(parseRangeBody(body, suffix)).toBe(false);
    }
  });

  it('does not match a suffix that merely shares a prefix', () => {
    const shorter = `${suffix}:0`;

    expect(parseRangeBody(shorter, 'AA1E4C9B93F3F0682250B6CF8331B7EE68FD')).toBe(false);
  });
});

describe('BreachedPasswordService', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  /** A response double, since only `ok` and `text()` are used. */
  const respondWith = (body: string, ok = true, status = 200): jest.Mock => {
    const mock = jest.fn().mockResolvedValue({ ok, status, text: async () => body });
    globalThis.fetch = mock as unknown as typeof fetch;

    return mock;
  };

  it('asks only for the five-character prefix', async () => {
    const fetchMock = respondWith('A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F:1');
    const { prefix, suffix } = toRangeKey('password');

    await new BreachedPasswordService().isBreached('password');

    const requested = fetchMock.mock.calls[0][0] as string;

    expect(requested).toBe(`https://api.pwnedpasswords.com/range/${prefix}`);
    // The half that would let the server reconstruct the hash must not be on the wire. (The hostname
    // itself contains "passwords", so the meaningful assertion is about the suffix.)
    expect(requested).not.toContain(suffix);
    expect(fetchMock.mock.calls[0][1].headers['Add-Padding']).toBe('true');
  });

  it('reports a breached password', async () => {
    const { suffix } = toRangeKey('password');
    respondWith(`${suffix}:3303003\nBADF00D:2`);

    await expect(new BreachedPasswordService().isBreached('password')).resolves.toBe(true);
  });

  it('accepts a password the corpus does not know', async () => {
    respondWith('000000000000000000000000000000000AA:2');

    await expect(new BreachedPasswordService().isBreached('a-unique-passphrase-42')).resolves.toBe(
      false,
    );
  });

  it('fails OPEN when the service errors, rather than blocking registrations', async () => {
    // A third party's outage must not stop the product signing anybody up. The blocklist is defence in
    // depth on top of a twelve-character minimum, not the thing holding the door shut.
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('ECONNREFUSED')) as unknown as typeof fetch;

    await expect(new BreachedPasswordService().isBreached('password')).resolves.toBe(false);
  });

  it('fails open on a non-200 response', async () => {
    respondWith('rate limited', false, 429);

    await expect(new BreachedPasswordService().isBreached('password')).resolves.toBe(false);
  });

  it('gives up rather than hanging the sign-up form', async () => {
    // A lookup that never settles must not become a request that never settles.
    globalThis.fetch = jest.fn(
      () => new Promise(() => {}) as Promise<Response>,
    ) as unknown as typeof fetch;

    const service = new BreachedPasswordService();
    service.timeoutMs = 10;

    await expect(service.isBreached('password')).resolves.toBe(false);
  });

  it('warns when it lets a password through unverified, so the gap is visible', async () => {
    const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('down')) as unknown as typeof fetch;

    await new BreachedPasswordService().isBreached('password');

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('allowing the password'));
  });
});
