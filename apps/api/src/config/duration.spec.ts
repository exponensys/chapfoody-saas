import { parseDurationSeconds } from './duration.js';

describe('parseDurationSeconds', () => {
  it('parses plain seconds', () => {
    expect(parseDurationSeconds('900', 'TTL')).toBe(900);
  });

  it('parses every supported unit', () => {
    expect(parseDurationSeconds('45s', 'TTL')).toBe(45);
    expect(parseDurationSeconds('15m', 'TTL')).toBe(900);
    expect(parseDurationSeconds('2h', 'TTL')).toBe(7_200);
    expect(parseDurationSeconds('30d', 'TTL')).toBe(2_592_000);
  });

  it('tolerates whitespace and mixed case', () => {
    expect(parseDurationSeconds('  15 M ', 'TTL')).toBe(900);
    expect(parseDurationSeconds('30D', 'TTL')).toBe(2_592_000);
  });

  it('treats a bare number as seconds, not as the last unit seen', () => {
    expect(parseDurationSeconds('30', 'TTL')).toBe(30);
  });

  // ── The failures that matter ─────────────────────────────────────────────────
  // Each of these would otherwise become a session that expires at a surprising moment, which is the
  // hardest kind of bug to attribute after the fact.

  it('refuses a unit it does not know rather than guessing', () => {
    // "15w" is a plausible thing to write and a meaningless thing to accept: treating the trailing
    // letter as seconds would silently turn two weeks into fifteen seconds.
    expect(() => parseDurationSeconds('15w', 'TTL')).toThrow(/TTL must be a duration/);
  });

  it('refuses zero', () => {
    expect(() => parseDurationSeconds('0s', 'TTL')).toThrow(/greater than zero/);
    expect(() => parseDurationSeconds('0', 'TTL')).toThrow(/greater than zero/);
  });

  it('refuses a negative duration', () => {
    expect(() => parseDurationSeconds('-15m', 'TTL')).toThrow(/TTL must be a duration/);
  });

  it('refuses an empty or malformed value, and names the variable', () => {
    expect(() => parseDurationSeconds('', 'REFRESH_TOKEN_TTL')).toThrow(/REFRESH_TOKEN_TTL/);
    expect(() => parseDurationSeconds('abc', 'REFRESH_TOKEN_TTL')).toThrow(/REFRESH_TOKEN_TTL/);
    expect(() => parseDurationSeconds('15m30s', 'REFRESH_TOKEN_TTL')).toThrow(/REFRESH_TOKEN_TTL/);
  });

  it('refuses a value that would overflow a safe integer', () => {
    expect(() => parseDurationSeconds('999999999999999d', 'TTL')).toThrow(/too large/);
  });
});
