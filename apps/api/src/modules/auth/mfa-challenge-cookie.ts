import type { ApiEnv } from '../../config/env.js';
import { readCookie, type CookieOptions } from './cookies.js';
import { MFA_CHALLENGE_TTL_SECONDS } from './token.service.js';

/**
 * A short-lived cookie holding an MFA challenge token, for sign-ins that never had a request body.
 *
 * ── Why a cookie rather than a query parameter ───────────────────────────────
 * The Google flow hands the browser back through a redirect, so the challenge has to travel somewhere.
 * A query parameter would carry a credential that is worth as much as a password through the browser's
 * history, its session restore, and any `Referer` the destination page emits — the classic way a token
 * ends up in an analytics log. An `httpOnly` cookie is sent by the browser and read by no script.
 *
 * ── Why `lax` ────────────────────────────────────────────────────────────────
 * The cookie is set on a redirect from `accounts.google.com`, which is a cross-site navigation. `Lax`
 * cookies survive that; `Strict` ones do not, and the challenge would vanish between being set and
 * being read.
 *
 * The token inside is the same one `login` issues for a password sign-in: single-purpose, five minutes,
 * and unusable as an access token — `JwtAuthGuard` refuses anything without a session claim.
 */

export const MFA_CHALLENGE_COOKIE = 'cf_mfa_challenge';

/** Same narrow path as the refresh cookie: it is only ever read by the MFA verify endpoint. */
export const MFA_CHALLENGE_PATH = '/v1/auth';

export function mfaChallengeCookieOptions(env: ApiEnv, withMaxAge: boolean): CookieOptions {
  return {
    httpOnly: true,
    secure: env.auth.cookie.secure,
    sameSite: 'lax',
    path: MFA_CHALLENGE_PATH,
    ...(env.auth.cookie.domain === undefined ? {} : { domain: env.auth.cookie.domain }),
    ...(withMaxAge ? { maxAge: MFA_CHALLENGE_TTL_SECONDS * 1000 } : {}),
  };
}

export function readMfaChallengeCookie(header: string | undefined): string | undefined {
  return readCookie(header, MFA_CHALLENGE_COOKIE);
}
