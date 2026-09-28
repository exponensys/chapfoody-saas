import type { ApiEnv } from '../../config/env.js';

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

export interface CookieOptions {
  httpOnly: true;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
  domain?: string;
  maxAge?: number;
}

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
 * Hand-rolled rather than adding `cookie-parser`, matching how this codebase treated `@nestjs/config`:
 * the parse is a handful of lines, and a dependency that rewrites `req.cookies` for every route is a
 * large surface for one value read on one endpoint.
 *
 * Splitting on the first `=` matters: the token is base64url and may itself contain no `=` padding, but
 * a cookie value in general can, and splitting on every `=` would truncate it.
 */
export function readRefreshCookie(env: ApiEnv, header: string | undefined): string | undefined {
  if (header === undefined || header === '') {
    return undefined;
  }

  const name = refreshCookieName(env);

  for (const part of header.split(';')) {
    const separator = part.indexOf('=');

    if (separator === -1) {
      continue;
    }

    if (part.slice(0, separator).trim() !== name) {
      continue;
    }

    const value = part.slice(separator + 1).trim();

    try {
      // A `%` that is not valid percent-encoding would throw; an undecodable value is simply not our
      // cookie, so the raw text is returned and rejected downstream by the hash lookup.
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  return undefined;
}
