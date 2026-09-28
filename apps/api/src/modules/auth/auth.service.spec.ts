import { hashPassword } from '../../infra/crypto/password.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { makeTestEnv } from '../../../test/helpers/test-env.js';
import type { ApiEnv } from '../../config/env.js';
import { AuthService } from './auth.service.js';
import type { BreachedPasswordService } from './breached-password.service.js';
import type { GoogleOAuthService } from './google-oauth.service.js';
import type { MfaService } from './mfa.service.js';
import type { TokenService } from './token.service.js';

/**
 * The login path's second factor.
 *
 * The milestone's DoD is a single sentence — "an account with MFA enabled cannot obtain a token without
 * a valid TOTP code" — and this is where it is either true or not. The assertions are about what is NOT
 * produced as much as what is: a correct password on an MFA account must return no access token and must
 * not open a session, because that is the whole point of the second factor.
 *
 * Tenant resolution is mocked rather than exercised: `runAsTenant` and the row-level policies it drives
 * have their own integration tests, and reproducing them here would be testing Postgres.
 */
jest.mock('../../infra/prisma/tenant-context.js', () => ({
  runAsTenant: jest.fn(
    async (_client: unknown, _context: unknown, work: (tx: unknown) => Promise<unknown>) =>
      work({ businessMember: { findFirst: async () => ({ businessId: 'biz-1' }) } }),
  ),
}));

describe('AuthService — MFA gating', () => {
  const env = makeTestEnv() as ApiEnv;
  const password = 'Resto123#@!$';

  let client: {
    user: { findUnique: jest.Mock; update: jest.Mock; create: jest.Mock };
    account: { findUnique: jest.Mock; create: jest.Mock };
  };
  let tokens: {
    startSession: jest.Mock;
    signMfaChallenge: jest.Mock;
    verifyMfaChallenge: jest.Mock;
    revokeSession: jest.Mock;
    revokeOtherSessions: jest.Mock;
    createVerificationToken: jest.Mock;
    consumeVerificationToken: jest.Mock;
  };
  let mfa: { isEnabled: jest.Mock; verifyForUser: jest.Mock };
  let google: { authorizationUrl: jest.Mock; exchangeCode: jest.Mock };
  let breached: { isBreached: jest.Mock };
  let service: AuthService;
  let passwordHash: string;

  const userRow = (overrides: Record<string, unknown> = {}): Record<string, unknown> => ({
    id: 'user-1',
    email: 'resto@email.com',
    firstName: 'Awa',
    lastName: 'Diallo',
    status: 'ACTIVE',
    platformRole: null,
    mustChangePassword: false,
    emailVerifiedAt: new Date(),
    locale: 'fr',
    passwordHash,
    failedLoginAttempts: 0,
    lockedUntil: null,
    deletedAt: null,
    ...overrides,
  });

  beforeAll(async () => {
    // A real Argon2 hash: the service verifies with the real thing, and a stub would test the stub.
    passwordHash = await hashPassword(password);
  });

  beforeEach(() => {
    client = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn().mockResolvedValue({}),
        create: jest.fn(),
      },
      account: { findUnique: jest.fn().mockResolvedValue(null), create: jest.fn().mockResolvedValue({}) },
    };

    tokens = {
      startSession: jest.fn().mockResolvedValue({
        accessToken: 'access',
        refreshToken: 'refresh',
        accessExpiresInSeconds: 900,
      }),
      signMfaChallenge: jest.fn().mockResolvedValue('challenge.token'),
      verifyMfaChallenge: jest.fn().mockResolvedValue('user-1'),
      revokeSession: jest.fn().mockResolvedValue(undefined),
      revokeOtherSessions: jest.fn().mockResolvedValue(undefined),
      createVerificationToken: jest.fn().mockResolvedValue('the-verification-token'),
      consumeVerificationToken: jest.fn().mockResolvedValue(null),
    };

    mfa = { isEnabled: jest.fn().mockResolvedValue(false), verifyForUser: jest.fn() };

    google = { authorizationUrl: jest.fn(), exchangeCode: jest.fn() };

    // Passwords are assumed unbreached unless a test says otherwise: the real service reaches the network,
    // and no unit test should depend on a third party being up.
    breached = { isBreached: jest.fn().mockResolvedValue(false) };

    service = new AuthService(
      env,
      { getClient: () => client } as unknown as PrismaService,
      tokens as unknown as TokenService,
      mfa as unknown as MfaService,
      google as unknown as GoogleOAuthService,
      breached as unknown as BreachedPasswordService,
    );
  });

  const login = () => service.login({ email: 'resto@email.com', password });

  it('returns a session when the account has no second factor', async () => {
    client.user.findUnique.mockResolvedValue(userRow());

    const outcome = await login();

    expect(outcome.kind).toBe('session');
    expect(tokens.startSession).toHaveBeenCalled();
  });

  it('returns NO session and NO token when MFA is enabled', async () => {
    client.user.findUnique.mockResolvedValue(userRow());
    mfa.isEnabled.mockResolvedValue(true);

    const outcome = await login();

    // The DoD, stated negatively: a correct password is not enough.
    expect(outcome.kind).toBe('mfa_required');
    expect(tokens.startSession).not.toHaveBeenCalled();
    expect(outcome).not.toHaveProperty('tokens');
  });

  it('issues a challenge token with a short expiry', async () => {
    client.user.findUnique.mockResolvedValue(userRow());
    mfa.isEnabled.mockResolvedValue(true);

    const outcome = await login();

    expect(tokens.signMfaChallenge).toHaveBeenCalledWith('user-1');

    if (outcome.kind === 'mfa_required') {
      expect(outcome.challengeToken).toBe('challenge.token');
      // Minutes, not hours: the challenge is worth as much as a password.
      expect(outcome.expiresInSeconds).toBeLessThanOrEqual(600);
    }
  });

  it('still clears the failed-attempt counters, so a correct password is not punished', async () => {
    client.user.findUnique.mockResolvedValue(userRow({ failedLoginAttempts: 3 }));
    mfa.isEnabled.mockResolvedValue(true);

    await login();

    // Otherwise a user who keeps failing their second factor would creep towards a lockout for the
    // password they demonstrably know.
    expect(client.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });
  });

  it('does not record a sign-in until the second factor is supplied', async () => {
    client.user.findUnique.mockResolvedValue(userRow());
    mfa.isEnabled.mockResolvedValue(true);

    await login();

    // `lastLoginAt` belongs to a completed authentication, not to a half of one.
    expect(client.user.update).not.toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ lastLoginAt: expect.any(Date) }),
      }),
    );
  });

  describe('verifyMfa', () => {
    const verify = () => service.verifyMfa({ challengeToken: 'challenge.token', code: '123456' });

    it('opens a session once the code checks out', async () => {
      mfa.verifyForUser.mockResolvedValue(true);
      client.user.findUnique.mockResolvedValue(userRow());

      const outcome = await verify();

      expect(outcome.kind).toBe('session');
      expect(tokens.startSession).toHaveBeenCalled();
      expect(client.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { lastLoginAt: expect.any(Date) },
      });
    });

    it('refuses a bad code without opening anything', async () => {
      mfa.verifyForUser.mockResolvedValue(false);

      await expect(verify()).rejects.toThrow(/Code de vérification invalide/);
      expect(tokens.startSession).not.toHaveBeenCalled();
    });

    it('re-checks the account, because a challenge lives for minutes', async () => {
      mfa.verifyForUser.mockResolvedValue(true);
      client.user.findUnique.mockResolvedValue(userRow({ status: 'SUSPENDED' }));

      // Suspending an account must take effect at once, not once the challenge already issued expires.
      await expect(verify()).rejects.toThrow(/Identifiants invalides/);
      expect(tokens.startSession).not.toHaveBeenCalled();
    });

    it('refuses a deleted account holding a valid code', async () => {
      mfa.verifyForUser.mockResolvedValue(true);
      client.user.findUnique.mockResolvedValue(userRow({ deletedAt: new Date() }));

      await expect(verify()).rejects.toThrow(/Identifiants invalides/);
    });
  });

  describe('loginWithGoogle — linking rules', () => {
    const identity = (overrides: Record<string, unknown> = {}) => ({
      providerAccountId: 'google-sub-1',
      email: 'resto@email.com',
      emailVerified: true,
      firstName: 'Awa',
      lastName: 'Diallo',
      avatarUrl: undefined as string | undefined,
      ...overrides,
    });

    const login = (overrides: Record<string, unknown> = {}) =>
      service.loginWithGoogle(identity(overrides), {});

    it('signs in through an existing link without consulting the e-mail at all', async () => {
      client.account.findUnique.mockResolvedValue({ userId: 'user-1' });
      client.user.findUnique.mockResolvedValue(userRow());

      const outcome = await login();

      expect(outcome.kind).toBe('session');
      // `sub` is stable and cannot be renamed; the address is only a linking hint.
      expect(client.account.create).not.toHaveBeenCalled();
    });

    it('links to an existing, VERIFIED account and signs it in', async () => {
      client.user.findUnique.mockResolvedValue(userRow({ emailVerifiedAt: new Date() }));

      const outcome = await login();

      expect(outcome.kind).toBe('session');
      expect(client.account.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-1',
            provider: 'GOOGLE',
            providerAccountId: 'google-sub-1',
          }),
        }),
      );
    });

    it('REFUSES to link to an existing account whose e-mail was never verified', async () => {
      // The pre-registration attack: someone signs up with the victim's address and a password they
      // know. If a later Google sign-in silently merged with that row, the attacker's password would
      // open the victim's account.
      client.user.findUnique.mockResolvedValue(userRow({ emailVerifiedAt: null }));

      await expect(login()).rejects.toThrow(/Connectez-vous avec votre mot de passe/);
      expect(client.account.create).not.toHaveBeenCalled();
      expect(tokens.startSession).not.toHaveBeenCalled();
    });

    it('creates the account for an address nobody has seen', async () => {
      client.user.findUnique.mockResolvedValue(null);
      client.user.create.mockResolvedValue(userRow({ email: 'new@email.com' }));

      const outcome = await login({ email: 'new@email.com' });

      expect(outcome.kind).toBe('session');

      const created = client.user.create.mock.calls[0][0].data;

      expect(created.emailVerifiedAt).toBeInstanceOf(Date);
      // A placeholder hash would be a password nobody chose.
      expect(created).not.toHaveProperty('passwordHash');
      expect(created.accounts.create.provider).toBe('GOOGLE');
    });

    it('does not mark the address verified when Google has not', async () => {
      client.user.findUnique.mockResolvedValue(null);
      client.user.create.mockResolvedValue(userRow());

      await login({ emailVerified: false });

      expect(client.user.create.mock.calls[0][0].data.emailVerifiedAt).toBeNull();
    });

    it('STILL demands the second factor, so Google is not an MFA bypass', async () => {
      // Without this, every account with MFA would have a documented way around it.
      client.account.findUnique.mockResolvedValue({ userId: 'user-1' });
      client.user.findUnique.mockResolvedValue(userRow());
      mfa.isEnabled.mockResolvedValue(true);

      const outcome = await login();

      expect(outcome.kind).toBe('mfa_required');
      expect(tokens.startSession).not.toHaveBeenCalled();
    });

    it('refuses a linked account that has since been suspended', async () => {
      client.account.findUnique.mockResolvedValue({ userId: 'user-1' });
      client.user.findUnique.mockResolvedValue(userRow({ status: 'SUSPENDED' }));

      await expect(login()).rejects.toThrow(/Identifiants invalides/);
      expect(tokens.startSession).not.toHaveBeenCalled();
    });

    it('survives two callbacks racing on the same new account', async () => {
      // A double-click produces two callbacks. The loser gets a unique violation and must end up using
      // the row the winner created rather than failing the sign-in.
      client.user.findUnique.mockResolvedValue(null);
      client.user.create.mockRejectedValue(Object.assign(new Error('unique'), { code: 'P2002' }));

      // The retry re-resolves, and this time the account exists.
      client.account.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ userId: 'user-1' });
      client.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(userRow());

      const outcome = await login();

      expect(outcome.kind).toBe('session');
    });
  });

  describe('register', () => {
    const register = (overrides: Record<string, unknown> = {}) =>
      service.register({
        email: 'new@email.com',
        password: 'une phrase de passe correcte',
        firstName: 'Awa',
        lastName: 'Diallo',
        ...overrides,
      } as { email: string; password: string; firstName: string; lastName: string });

    it('stores a HASH, never the password itself', async () => {
      client.user.findUnique.mockResolvedValue(null);
      client.user.create.mockResolvedValue({ id: 'user-1' });

      await register();

      const created = client.user.create.mock.calls[0][0].data;

      expect(created.passwordHash).not.toBe('une phrase de passe correcte');
      expect(created.passwordHash).toMatch(/^\$argon2id\$/);
    });

    it('leaves the address UNVERIFIED, so the Google linking rule can trust it later', async () => {
      client.user.findUnique.mockResolvedValue(null);
      client.user.create.mockResolvedValue({ id: 'user-1' });

      await register();

      // The same trick as an attacker pre-registering somebody else's address, so the flag starts false.
      expect(client.user.create.mock.calls[0][0].data.emailVerifiedAt).toBeNull();
    });

    it('normalises the address, which is what makes the unique index case-insensitive', async () => {
      client.user.findUnique.mockResolvedValue(null);
      client.user.create.mockResolvedValue({ id: 'user-1' });

      await register({ email: '  New@Email.COM ' });

      expect(client.user.findUnique.mock.calls[0][0].where.email).toBe('new@email.com');
    });

    it('does nothing visible when the address is ALREADY registered', async () => {
      // The enumeration defence: no error, no different status, no body.
      client.user.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(register()).resolves.toBeUndefined();
      expect(client.user.create).not.toHaveBeenCalled();
    });

    it('still does the expensive work for a duplicate, so timing does not leak', async () => {
      // Returning early would make duplicate sign-ups finish in microseconds against a real
      // registration's Argon2 cost, and response time is as good an oracle as a message.
      client.user.findUnique.mockResolvedValue({ id: 'existing' });

      await register();

      expect(breached.isBreached).toHaveBeenCalled();
    });

    it('does not send a second verification mail to an existing address', async () => {
      // Otherwise the form becomes a way to mail-bomb somebody who never asked.
      client.user.findUnique.mockResolvedValue({ id: 'existing' });

      await register();

      expect(tokens.createVerificationToken).not.toHaveBeenCalled();
    });

    it('sends a verification link for a new account', async () => {
      client.user.findUnique.mockResolvedValue(null);
      client.user.create.mockResolvedValue({ id: 'user-1' });

      await register();

      expect(tokens.createVerificationToken).toHaveBeenCalledWith(
        'user-1',
        'EMAIL_VERIFY',
        expect.any(Number),
      );
    });

    it('refuses a password the policy rejects, with a message that says what to change', async () => {
      await expect(register({ password: 'court' })).rejects.toThrow(/au moins 12 caractères/);
      expect(client.user.create).not.toHaveBeenCalled();
    });

    it('refuses a breached password', async () => {
      breached.isBreached.mockResolvedValue(true);

      await expect(register()).rejects.toThrow(/fuites de données connues/);
      expect(client.user.create).not.toHaveBeenCalled();
    });

    it('answers a race on the same address exactly like a duplicate', async () => {
      client.user.findUnique.mockResolvedValue(null);
      client.user.create.mockRejectedValue(Object.assign(new Error('unique'), { code: 'P2002' }));

      await expect(register()).resolves.toBeUndefined();
    });
  });

  describe('verifyEmail', () => {
    it('marks the address verified when the token is good', async () => {
      tokens.consumeVerificationToken.mockResolvedValue('user-1');

      await service.verifyEmail('the-token');

      expect(client.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { emailVerifiedAt: expect.any(Date) },
      });
    });

    it('gives ONE message for unknown, expired and already-used tokens', async () => {
      // Distinguishing them would let somebody walk the token space and learn which links were ever real.
      tokens.consumeVerificationToken.mockResolvedValue(null);

      await expect(service.verifyEmail('a-guess')).rejects.toThrow(/invalide ou a expiré/);
      expect(client.user.update).not.toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    const change = (input: Record<string, unknown> = {}) =>
      service.changePassword('user-1', 'session-1', {
        currentPassword: password,
        newPassword: 'une nouvelle phrase de passe',
        ...input,
      } as { currentPassword?: string; newPassword: string });

    beforeEach(async () => {
      client.user.findUnique.mockResolvedValue({
        email: 'resto@email.com',
        firstName: 'Awa',
        lastName: 'Diallo',
        passwordHash: await hashPassword(password),
      });
    });

    it('requires the CURRENT password, even with a valid session', async () => {
      // A session is a bearer credential; without this, a borrowed laptop is a full account takeover.
      await expect(change({ currentPassword: 'wrong' })).rejects.toThrow(/actuel incorrect/);
      expect(client.user.update).not.toHaveBeenCalled();
    });

    it('refuses when no current password is supplied at all', async () => {
      await expect(change({ currentPassword: undefined })).rejects.toThrow(/actuel incorrect/);
    });

    it('stores the new hash and clears mustChangePassword', async () => {
      await change();

      const update = client.user.update.mock.calls[0][0].data;

      expect(update.passwordHash).toMatch(/^\$argon2id\$/);
      // The rotation that was being demanded has now happened.
      expect(update.mustChangePassword).toBe(false);
      // A lockout was about the OLD password.
      expect(update.lockedUntil).toBeNull();
      expect(update.failedLoginAttempts).toBe(0);
    });

    it('signs every OTHER session out, but not the one making the request', async () => {
      // The usual reason somebody changes a password is that they think somebody else knows it.
      await change();

      expect(tokens.revokeOtherSessions).toHaveBeenCalledWith(
        'user-1',
        'session-1',
        'password_change',
      );
    });

    it('lets a Google-only account SET a password without confirming one', async () => {
      // There is no current password to prove, and the session is what authorises the change.
      client.user.findUnique.mockResolvedValue({
        email: 'resto@email.com',
        firstName: 'Awa',
        lastName: 'Diallo',
        passwordHash: null,
      });

      await expect(change({ currentPassword: undefined })).resolves.toBeUndefined();
      expect(client.user.update).toHaveBeenCalled();
    });

    it('applies the policy to the new password', async () => {
      await expect(change({ newPassword: 'court' })).rejects.toThrow(/au moins 12 caractères/);
    });

    it('refuses a new password that is breached', async () => {
      breached.isBreached.mockResolvedValue(true);

      await expect(change()).rejects.toThrow(/fuites de données connues/);
    });
  });
});
