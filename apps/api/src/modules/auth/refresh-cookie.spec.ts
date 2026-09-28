import { makeTestEnv } from '../../../test/helpers/test-env.js';
import { readRefreshCookie, refreshCookieOptions } from './refresh-cookie.js';

/**
 * The refresh cookie's serialisation and parsing.
 *
 * Hand-rolled instead of using `cookie-parser`, so the edge cases are ours to get right — which is
 * exactly why they are pinned here rather than discovered in production.
 */
describe('refresh cookie', () => {
  const env = makeTestEnv();

  describe('options', () => {
    it('is httpOnly, path-scoped, and SameSite per the environment', () => {
      const options = refreshCookieOptions(env, true);

      expect(options).toMatchObject({
        httpOnly: true,
        secure: false, // test environment is http
        sameSite: 'lax',
        path: '/v1/auth',
      });
      expect(options.maxAge).toBe(env.auth.refreshTtlSeconds * 1000);
    });

    it('scopes the path to the refresh endpoint so it is not sent with ordinary calls', () => {
      // The narrower the path, the less often a long-lived credential is on the wire.
      expect(refreshCookieOptions(env, true).path).toBe('/v1/auth');
    });

    it('omits maxAge when clearing, which is what makes it a session cookie that expires now', () => {
      expect(refreshCookieOptions(env, false)).not.toHaveProperty('maxAge');
    });

    it('carries the domain only when one is configured', () => {
      expect(refreshCookieOptions(env, true)).not.toHaveProperty('domain');

      const withDomain = makeTestEnv({
        auth: {
          ...env.auth,
          cookie: { ...env.auth.cookie, domain: '.chapfoody.test' },
        },
      });

      expect(refreshCookieOptions(withDomain, true).domain).toBe('.chapfoody.test');
    });
  });

  describe('readRefreshCookie', () => {
    it('finds the value among other cookies', () => {
      const header = `other=1; ${env.auth.cookie.name}=the-token; another=2`;

      expect(readRefreshCookie(env, header)).toBe('the-token');
    });

    it('splits on the FIRST = only, so a value containing one survives', () => {
      // base64 values can carry padding, and splitting on every `=` would truncate the token.
      const header = `${env.auth.cookie.name}=abc=def`;

      expect(readRefreshCookie(env, header)).toBe('abc=def');
    });

    it('decodes a percent-encoded value', () => {
      const header = `${env.auth.cookie.name}=a%20b`;

      expect(readRefreshCookie(env, header)).toBe('a b');
    });

    it('returns the raw text rather than throwing on malformed encoding', () => {
      // An undecodable value is simply not a token we issued, and the hash lookup will reject it.
      // Throwing here would turn a bad cookie into a 500.
      const header = `${env.auth.cookie.name}=%E0%A4%A`;

      expect(readRefreshCookie(env, header)).toBe('%E0%A4%A');
    });

    it('returns undefined for a missing header, an empty header, or no matching cookie', () => {
      expect(readRefreshCookie(env, undefined)).toBeUndefined();
      expect(readRefreshCookie(env, '')).toBeUndefined();
      expect(readRefreshCookie(env, 'other=1; another=2')).toBeUndefined();
    });

    it('does not match a cookie whose name merely ENDS with ours', () => {
      // `not_cf_refresh` must not be read as `cf_refresh`: the comparison is on the exact name.
      const header = `x_${env.auth.cookie.name}=wrong`;

      expect(readRefreshCookie(env, header)).toBeUndefined();
    });

    it('tolerates whitespace around the name and value', () => {
      const header = `  ${env.auth.cookie.name} =  spaced-token  `;

      expect(readRefreshCookie(env, header)).toBe('spaced-token');
    });
  });
});
