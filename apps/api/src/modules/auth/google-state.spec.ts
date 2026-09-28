import type { ApiEnv } from '../../config/env.js';
import { makeTestEnv } from '../../../test/helpers/test-env.js';
import {
  OAUTH_STATE_COOKIE,
  OAUTH_STATE_PATH,
  newOAuthState,
  oauthStateCookieOptions,
  readOAuthState,
} from './google-state.js';

/**
 * The OAuth state cookie.
 *
 * Two of these assertions are the whole mechanism: the state must be unguessable, and it must be sent
 * on a cross-site top-level navigation. The second one is the trap — a `Strict` cookie is missing at the
 * callback, and the symptom is a "state mismatch" that looks exactly like an attack.
 */
describe('OAuth state cookie', () => {
  const env = makeTestEnv() as ApiEnv;

  it('is unguessable, and different every time', () => {
    const first = newOAuthState();
    const second = newOAuthState();

    expect(first).not.toBe(second);
    // 24 random bytes, base64url: 32 characters and no padding to escape in a header.
    expect(first).toHaveLength(32);
    expect(first).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('is httpOnly, so no script can read the half that must stay secret', () => {
    expect(oauthStateCookieOptions(env, true).httpOnly).toBe(true);
  });

  it('is sent on a cross-site top-level navigation — hence lax, not strict', () => {
    // The callback arrives from accounts.google.com. `Strict` cookies are NOT sent on that navigation,
    // so a strict state cookie would be absent at the callback and every Google sign-in would fail.
    expect(oauthStateCookieOptions(env, true).sameSite).toBe('lax');
  });

  it('is scoped to the two Google endpoints and nothing else', () => {
    expect(oauthStateCookieOptions(env, true).path).toBe(OAUTH_STATE_PATH);
    expect(OAUTH_STATE_PATH).toBe('/v1/auth/google');
  });

  it('expires, so an abandoned flow does not leave a live cookie behind', () => {
    expect(oauthStateCookieOptions(env, true).maxAge).toBe(600_000);
    // Clearing it must not re-add a lifetime.
    expect(oauthStateCookieOptions(env, false).maxAge).toBeUndefined();
  });

  it('follows the environment for Secure, like every other cookie', () => {
    expect(oauthStateCookieOptions(env, true).secure).toBe(false);
    expect(
      oauthStateCookieOptions({ ...env, auth: { ...env.auth, cookie: { ...env.auth.cookie, secure: true } } }, true)
        .secure,
    ).toBe(true);
  });

  describe('readOAuthState', () => {
    it('finds the state among other cookies', () => {
      const header = `other=1; ${OAUTH_STATE_COOKIE}=abc123; ${'cf_refresh'}=zzz`;

      expect(readOAuthState(header)).toBe('abc123');
    });

    it('returns undefined rather than throwing when it is absent', () => {
      for (const header of [undefined, '', 'other=1', 'no-equals-sign']) {
        expect(readOAuthState(header)).toBeUndefined();
      }
    });

    it('survives a value containing = rather than truncating it', () => {
      // Splitting on every `=` would cut the value at the first one.
      expect(readOAuthState(`${OAUTH_STATE_COOKIE}=ab=cd`)).toBe('ab=cd');
    });
  });
});
