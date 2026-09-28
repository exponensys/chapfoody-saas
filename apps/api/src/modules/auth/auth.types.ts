import type { Request } from 'express';

import type { TenantMembership } from './access.decorators.js';

/**
 * What a valid access token asserts.
 *
 * Deliberately small. `sid` is the important one: it names the session, which is what lets a stateless
 * token be revoked in practice — the guard looks the session up and refuses a token whose session has
 * ended, so a credential that cannot be taken back can still be refused.
 */
export interface AccessTokenPayload {
  /** The user. */
  sub: string;
  /** The session this token belongs to. */
  sid: string;
  /** The business the session is operating in, when it is acting in one. */
  bid?: string;
  /** Issued-at / expiry, added by the signer. */
  iat?: number;
  exp?: number;
}

/** The authenticated caller, attached to the request by `JwtAuthGuard`. */
export interface AuthPrincipal {
  userId: string;
  sessionId: string;
  businessId?: string | undefined;
}

/**
 * A request that has passed the guards.
 *
 * Loosely coupled to `access.decorators.ts` on purpose: the type of `membership` is declared there
 * beside the decorator that consumes it, so the two cannot drift.
 */
export interface RequestWithAuth extends Request {
  auth?: AuthPrincipal;
  membership?: TenantMembership;
}
