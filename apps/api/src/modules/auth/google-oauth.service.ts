import { Inject, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

import { AppException } from '../../common/errors/app.exception.js';
import type { ApiEnv } from '../../config/env.js';
import { API_ENV } from '../../config/env.token.js';

/** What Google tells us about the person who just signed in. */
export interface GoogleIdentity {
  /** Google's stable subject id. The account KEY — an e-mail can be changed, this cannot. */
  providerAccountId: string;
  /** Lower-cased, matching how `User.email` is stored. */
  email: string;
  /**
   * Whether Google has verified the address.
   *
   * Load-bearing rather than informational: it is what makes linking to an existing account safe, since
   * it means the person controls the mailbox. An unverified address proves nothing.
   */
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  avatarUrl: string | undefined;
}

/**
 * The Google half of sign-in: building the consent URL and reading back a verified identity.
 *
 * ── Why the ID token is verified rather than decoded ─────────────────────────
 * The `id_token` arrives from the browser, so it is attacker-controlled until proven otherwise. It is
 * checked as a signed JWT against Google's published keys, with the audience pinned to OUR client id —
 * without which a token minted for any other application would be accepted here. `verifyIdToken` does
 * that; a base64 decode of the payload would not, and is the mistake this class exists to avoid.
 *
 * ── The `sub` claim, not the e-mail, is the identity ─────────────────────────
 * An address can be renamed inside a Google account, and a Workspace admin can reassign one. `sub` is
 * stable for the life of the account, which is why `Account.providerAccountId` stores it and why the
 * lookup order is account-first, e-mail-second.
 */
@Injectable()
export class GoogleOAuthService {
  constructor(@Inject(API_ENV) private readonly env: ApiEnv) {}

  /** Whether the credentials are present. Sign-in is unavailable, not broken, when they are not. */
  get configured(): boolean {
    const { clientId, clientSecret, redirectUri } = this.env.auth.google;

    return clientId !== undefined && clientSecret !== undefined && redirectUri !== undefined;
  }

  /** The consent URL to send the browser to. */
  authorizationUrl(state: string): string {
    return this.client().generateAuthUrl({
      // 'online', not 'offline': nothing here calls Google on the user's behalf afterwards, and asking
      // for a refresh token would mean a long-lived credential to store and protect for no benefit.
      access_type: 'online',
      scope: ['openid', 'email', 'profile'],
      state,
      // Without this, a user signed into one Google account is not offered another, which looks to them
      // like the product ignoring the account they meant to use.
      prompt: 'select_account',
    });
  }

  /** Exchanges the authorization code and returns the verified identity behind it. */
  async exchangeCode(code: string): Promise<GoogleIdentity> {
    const { clientId } = this.env.auth.google;
    const client = this.client();

    let idToken: string | undefined;

    try {
      const { tokens } = await client.getToken(code);
      idToken = tokens.id_token ?? undefined;
    } catch {
      // Deliberately opaque: why a code was refused (already used, expired, wrong client) is Google's
      // business, and repeating it to the browser says more than a signed-out caller needs.
      throw AppException.unauthenticated('Connexion Google refusée. Réessayez.');
    }

    if (idToken === undefined) {
      // `openid` was requested, so an absent ID token means the response is not one we can trust.
      throw AppException.unauthenticated('Connexion Google refusée. Réessayez.');
    }

    let payload: Record<string, unknown> | undefined;

    try {
      const ticket = await client.verifyIdToken({ idToken, audience: clientId });
      payload = ticket.getPayload() as Record<string, unknown> | undefined;
    } catch {
      // A forged, expired, or wrong-audience token: all refused the same way, and none of it reaching
      // the caller as a distinguishable message.
      throw AppException.unauthenticated('Connexion Google refusée. Réessayez.');
    }

    const providerAccountId = payload?.['sub'];
    const email = payload?.['email'];

    if (typeof providerAccountId !== 'string' || typeof email !== 'string') {
      throw AppException.unauthenticated('Connexion Google refusée. Réessayez.');
    }

    const firstName = payload?.['given_name'];
    const lastName = payload?.['family_name'];
    const picture = payload?.['picture'];

    return {
      providerAccountId,
      // Stored lower-cased because the column is documented as always lower-cased, and that is what
      // makes its unique index genuinely case-insensitive.
      email: email.trim().toLowerCase(),
      emailVerified: payload?.['email_verified'] === true,
      // Falling back to the local part of the address: the schema requires both names, and a Google
      // account without a given name is common when the address was created by an organisation.
      firstName:
        typeof firstName === 'string' && firstName !== '' ? firstName : (email.split('@')[0] ?? 'Utilisateur'),
      lastName: typeof lastName === 'string' ? lastName : '',
      avatarUrl: typeof picture === 'string' ? picture : undefined,
    };
  }

  /** The configured client, or a clear refusal when sign-in has not been set up. */
  private client(): OAuth2Client {
    const { clientId, clientSecret, redirectUri } = this.env.auth.google;

    if (clientId === undefined || clientSecret === undefined || redirectUri === undefined) {
      // 503, not 500: nothing is broken, the deployment simply has not configured Google sign-in.
      throw new AppException(
        503,
        'SERVICE_UNAVAILABLE',
        'La connexion Google n’est pas configurée sur ce serveur.',
      );
    }

    // The redirect URI is on the client, so it is sent with the consent request AND with the token
    // exchange. Google requires the two to match exactly, and a client built without it silently
    // produces a mismatched exchange.
    return new OAuth2Client(clientId, clientSecret, redirectUri);
  }
}
