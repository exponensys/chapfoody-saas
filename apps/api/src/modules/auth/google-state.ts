import { randomBytes } from 'node:crypto';

import type { ApiEnv } from '../../config/env.js';
import { readCookie, type CookieOptions } from './cookies.js';

/**
 * The OAuth `state` parameter, kept in a cookie.
 *
 * ── What it is actually for ──────────────────────────────────────────────────
 * It is not about verifying the code. It is about binding the callback to the browser that started the
 * flow: without it, an attacker can obtain a valid authorization code for THEIR Google account and
 * feed the callback URL to a victim, whose session then becomes the attacker's account — a login-CSRF
 * that silently puts the victim's data where the attacker can see it.
 *
 * The cookie is the half that proves the browser; the query parameter is the half the attacker cannot
 * forge for a victim's browser. Comparing them is the whole mechanism.
 *
 * ── Why the path is narrower than the refresh cookie's ───────────────────────
 * It is sent to the two Google endpoints and nowhere else, so it is not on the wire for the refresh
 * calls that happen far more often.
 *
 * ── Why `lax` and not the configured value ───────────────────────────────────
 * The callback arrives as a top-level GET navigation from `accounts.google.com`, which is a CROSS-site
 * navigation. `SameSite=Lax` cookies are sent on exactly that, and `Strict` cookies are not — so a
 * `Strict` state cookie would be missing at the callback and every Google sign-in would fail with a
 * "state mismatch". That is a real trap: it looks like a CSRF failure when the flow is in fact correct.
 */

export const OAUTH_STATE_COOKIE = 'cf_oauth_state';
export const OAUTH_STATE_PATH = '/v1/auth/google';

/** How long the user has to finish at Google. Long enough to pick an account, short enough to matter. */
const STATE_TTL_SECONDS = 600;

/** 24 random bytes: unguessable, and bound to one browser for ten minutes. */
export function newOAuthState(): string {
  return randomBytes(24).toString('base64url');
}

export function oauthStateCookieOptions(env: ApiEnv, withMaxAge: boolean): CookieOptions {
  return {
    httpOnly: true,
    secure: env.auth.cookie.secure,
    sameSite: 'lax',
    path: OAUTH_STATE_PATH,
    ...(env.auth.cookie.domain === undefined ? {} : { domain: env.auth.cookie.domain }),
    ...(withMaxAge ? { maxAge: STATE_TTL_SECONDS * 1000 } : {}),
  };
}

export function readOAuthState(header: string | undefined): string | undefined {
  return readCookie(header, OAUTH_STATE_COOKIE);
}
