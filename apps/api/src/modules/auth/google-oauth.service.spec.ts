import type { ApiEnv } from '../../config/env.js';
import { makeTestEnv } from '../../../test/helpers/test-env.js';
import { GoogleOAuthService } from './google-oauth.service.js';

/**
 * The Google half: the consent URL, and what happens when the exchange or the ID token is not what it
 * should be.
 *
 * The library is mocked, which is the right level here: `verifyIdToken` is Google's code, and testing it
 * would be testing their JWT verification. What belongs to this codebase is the ERROR MAPPING — that
 * every failure becomes the same opaque refusal rather than leaking which step failed — and the fact
 * that the audience is pinned to our own client id.
 */
const mockGenerateAuthUrl = jest.fn();
const mockGetToken = jest.fn();
const mockVerifyIdToken = jest.fn();

jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    generateAuthUrl: mockGenerateAuthUrl,
    getToken: mockGetToken,
    verifyIdToken: mockVerifyIdToken,
  })),
}));

const configuredEnv = (): ApiEnv =>
  makeTestEnv({
    auth: {
      ...makeTestEnv().auth,
      google: {
        clientId: 'client-id',
        clientSecret: 'client-secret',
        redirectUri: 'http://localhost:4000/v1/auth/google/callback',
      },
    },
  }) as ApiEnv;

/** A successful exchange, so each test can change only the part it is about. */
const googleReturns = (payload: Record<string, unknown>): void => {
  mockGetToken.mockResolvedValue({ tokens: { id_token: 'header.payload.signature' } });
  mockVerifyIdToken.mockResolvedValue({ getPayload: () => payload });
};

describe('GoogleOAuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when sign-in is not configured', () => {
    it('reports itself unavailable rather than broken', () => {
      expect(new GoogleOAuthService(makeTestEnv() as ApiEnv).configured).toBe(false);
      expect(new GoogleOAuthService(configuredEnv()).configured).toBe(true);
    });

    it('refuses with a 503 and a message an operator can act on', () => {
      // 503, not 500: nothing is broken, the deployment simply has not been given credentials.
      expect(() => new GoogleOAuthService(makeTestEnv() as ApiEnv).authorizationUrl('state')).toThrow(
        /n’est pas configurée/,
      );
    });
  });

  describe('authorizationUrl', () => {
    it('passes the state through, which is what binds the callback to this browser', () => {
      mockGenerateAuthUrl.mockReturnValue('https://accounts.google.com/o/oauth2/v2/auth?...');

      const service = new GoogleOAuthService(configuredEnv());

      expect(service.authorizationUrl('the-state')).toBe(
        'https://accounts.google.com/o/oauth2/v2/auth?...',
      );
      expect(mockGenerateAuthUrl).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'the-state', access_type: 'online' }),
      );
    });

    it('asks for the three non-sensitive scopes and never for offline access', () => {
      mockGenerateAuthUrl.mockReturnValue('https://example.test');

      new GoogleOAuthService(configuredEnv()).authorizationUrl('s');

      const options = mockGenerateAuthUrl.mock.calls[0][0];

      expect(options.scope).toEqual(['openid', 'email', 'profile']);
      // 'offline' would mean a refresh token to store and protect, for a flow that never calls Google
      // again on the user's behalf.
      expect(options.access_type).toBe('online');
    });
  });

  describe('exchangeCode', () => {
    const service = (): GoogleOAuthService => new GoogleOAuthService(configuredEnv());

    it('returns the verified identity, with the address normalised', async () => {
      googleReturns({
        sub: 'google-sub-1',
        email: '  Resto@Email.COM ',
        email_verified: true,
        given_name: 'Awa',
        family_name: 'Diallo',
        picture: 'https://avatar.test/a.png',
      });

      await expect(service().exchangeCode('the-code')).resolves.toEqual({
        providerAccountId: 'google-sub-1',
        email: 'resto@email.com',
        emailVerified: true,
        firstName: 'Awa',
        lastName: 'Diallo',
        avatarUrl: 'https://avatar.test/a.png',
      });
    });

    it('verifies the token against OUR client id, not merely decodes it', async () => {
      // Without the audience check, an ID token minted for any other application would be accepted.
      googleReturns({ sub: 's', email: 'a@b.com' });

      await service().exchangeCode('the-code');

      expect(mockVerifyIdToken).toHaveBeenCalledWith({
        idToken: 'header.payload.signature',
        audience: 'client-id',
      });
    });

    it('falls back to the local part when Google sends no given name', async () => {
      googleReturns({ sub: 's', email: 'resto@email.com', email_verified: true });

      const identity = await service().exchangeCode('the-code');

      // The schema requires both names, and an organisation-created account often has neither.
      expect(identity.firstName).toBe('resto');
      expect(identity.lastName).toBe('');
      expect(identity.avatarUrl).toBeUndefined();
    });

    it('reports emailVerified false unless Google says exactly true', async () => {
      // A truthy-but-not-true value must not pass: this flag is what makes linking to an existing
      // account safe, so it is the one place worth being pedantic.
      googleReturns({ sub: 's', email: 'a@b.com', email_verified: 'yes' });

      await expect(service().exchangeCode('c')).resolves.toMatchObject({ emailVerified: false });
    });

    it('refuses identically when the code is refused', async () => {
      mockGetToken.mockRejectedValue(new Error('invalid_grant'));

      await expect(service().exchangeCode('c')).rejects.toThrow(/Connexion Google refusée/);
    });

    it('refuses when no ID token comes back', async () => {
      // `openid` was requested, so an absent ID token means the response is not one we can trust.
      mockGetToken.mockResolvedValue({ tokens: {} });

      await expect(service().exchangeCode('c')).rejects.toThrow(/Connexion Google refusée/);
    });

    it('refuses when verification fails, with the same message', async () => {
      // One message for every cause: which step failed is exactly the kind of detail that makes an
      // oracle useful to an attacker.
      mockGetToken.mockResolvedValue({ tokens: { id_token: 'forged' } });
      mockVerifyIdToken.mockRejectedValue(new Error('wrong audience'));

      await expect(service().exchangeCode('c')).rejects.toThrow(/Connexion Google refusée/);
    });

    it('refuses a verified token that carries no subject', async () => {
      googleReturns({ email: 'a@b.com' });

      await expect(service().exchangeCode('c')).rejects.toThrow(/Connexion Google refusée/);
    });

    it('refuses a verified token with no e-mail', async () => {
      googleReturns({ sub: 's' });

      await expect(service().exchangeCode('c')).rejects.toThrow(/Connexion Google refusée/);
    });
  });
});
