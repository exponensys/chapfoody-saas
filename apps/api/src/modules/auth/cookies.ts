/**
 * Cookie plumbing shared by the refresh cookie and the OAuth state cookie.
 *
 * Both are `httpOnly` values the API sets and reads back on a specific path, so the reader is one
 * function rather than two near-identical loops.
 */

export interface CookieOptions {
  httpOnly: true;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
  domain?: string;
  maxAge?: number;
}

/**
 * Reads one cookie out of a `Cookie` header.
 *
 * Hand-rolled rather than adding `cookie-parser`, matching how this codebase treated `@nestjs/config`:
 * the parse is a handful of lines, and a dependency that rewrites `req.cookies` for every route is a
 * large surface for one value read on a few endpoints.
 *
 * Splitting on the FIRST `=` matters. A cookie value can contain `=` (base64url padding, and some
 * state encodings), and splitting on every one would truncate it.
 */
export function readCookie(header: string | undefined, name: string): string | undefined {
  if (header === undefined || header === '') {
    return undefined;
  }

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
      // A `%` that is not valid percent-encoding would throw. An undecodable value is simply not our
      // cookie, so the raw text is returned and rejected downstream.
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  return undefined;
}
