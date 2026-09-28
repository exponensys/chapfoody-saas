import type { ApiEnv } from '../../config/env.js';
import { readCookie, type CookieOptions } from './cookies.js';

/**
 * The refresh cookie.
 *
 * ── Why httpOnly, and why it is the refresh token and not the access token ────
 * The access token is held in memory by the client and sent as a header: it is short-lived, so
 * JavaScript being able to read it is a small window. The refresh token is the long-lived credential,
 * and putting it in `httpOnly` means a cross-site scripting bug cannot read it — the browser will send
 * it, and only to this origin, but no script can take a copy of it.
 *
 * ── `Path` is scoped to the refresh endpoint ─────────────────────────────────
 * The cookie is not sent with ordinary API calls at all. That shrinks both what a leaked request
 * discloses and how often a long-lived credential is on the wire.
 */

/** The one path the refresh cookie is sent to. */
export const REFRESH_COOKIE_PATH = '/v1/auth';

// Re-exported so that callers importing it from here keep working now that the shape lives with the
// shared cookie plumbing.
export type { CookieOptions };

export function refreshCookieOptions(env: ApiEnv, withMaxAge: boolean): CookieOptions {
  return {
    httpOnly: true,
    secure: env.auth.cookie.secure,
    sameSite: env.auth.cookie.sameSite,
    path: REFRESH_COOKIE_PATH,
    ...(env.auth.cookie.domain === undefined ? {} : { domain: env.auth.cookie.domain }),
    ...(withMaxAge ? { maxAge: env.auth.refreshTtlSeconds * 1000 } : {}),
  };
}

export function refreshCookieName(env: ApiEnv): string {
  return env.auth.cookie.name;
}

/**
 * Reads the refresh cookie out of the `Cookie` header.
 *
 * Delegates to the shared reader in `cookies.ts`, which the OAuth state cookie and the MFA challenge
 * cookie also use. It used to carry its own copy of the parse, and two copies of "split on the first ="
 * is exactly the kind of thing that drifts while both look correct.
 */
export function readRefreshCookie(env: ApiEnv, header: string | undefined): string | undefined {
  return readCookie(header, refreshCookieName(env));
}
