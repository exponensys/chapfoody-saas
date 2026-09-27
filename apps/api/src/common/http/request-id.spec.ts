import { resolveRequestId } from './request-id.js';

/** A v4 UUID, which is what the fallback must produce. */
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('resolveRequestId', () => {
  it('reuses an opaque id from the client or a proxy', () => {
    // The shapes we expect in practice: UUIDs, OTel trace ids, LB request ids.
    for (const id of [
      '4f8c1b2e-6a1d-4f7b-9c3e-2d5a8b1f0e77',
      '4bf92f3577b34da6a3ce929d0e0e4736',
      'req-12345_ABC.def~ghi',
    ]) {
      expect(resolveRequestId(id)).toBe(id);
    }
  });

  it('generates a UUID when nothing is supplied', () => {
    expect(resolveRequestId()).toMatch(UUID_V4);
    expect(resolveRequestId(undefined)).toMatch(UUID_V4);
    expect(resolveRequestId('')).toMatch(UUID_V4);
  });

  it('takes the first value when the header was sent more than once', () => {
    expect(resolveRequestId(['first-id', 'second-id'])).toBe('first-id');
  });

  it.each([
    ['a space', 'bad id'],
    ['a newline (log forging)', 'abc\ndef'],
    ['a carriage return', 'abc\rX-Injected: yes'],
    ['an ANSI escape', 'abc\u001b[31mred'],
    ['a quote', 'abc"def'],
    ['an over-long value', 'a'.repeat(129)],
  ])('rejects %s and generates a fresh id instead', (_label, value) => {
    const resolved = resolveRequestId(value);

    expect(resolved).toMatch(UUID_V4);
    expect(resolved).not.toBe(value);
  });

  it('accepts an id of exactly the maximum length', () => {
    const value = 'a'.repeat(128);
    expect(resolveRequestId(value)).toBe(value);
  });

  it('produces a unique id per call, so unrelated requests never share a correlation', () => {
    const ids = new Set(Array.from({ length: 50 }, () => resolveRequestId()));
    expect(ids.size).toBe(50);
  });
});
