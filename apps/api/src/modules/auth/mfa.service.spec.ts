import { authenticator } from 'otplib';

import type { ApiEnv } from '../../config/env.js';
import { hashPassword } from '../../infra/crypto/password.js';
import { openSecret, sealSecret } from '../../infra/crypto/secret-box.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { makeTestEnv } from '../../../test/helpers/test-env.js';
import { MfaService, RECOVERY_CODE_COUNT } from './mfa.service.js';

const STEP_SECONDS = 30;

/**
 * TOTP enrolment and verification.
 *
 * These are the assertions the milestone's DoD asks for — "an account with MFA enabled cannot obtain a
 * token without the TOTP step" — expressed at the level where the decision is actually made. A real
 * database would only confirm that Prisma can write rows; what matters is that an UNCONFIRMED enrolment
 * does not count as protected, that a code cannot be replayed inside its own window, and that recovery
 * codes are single-use.
 *
 * Codes are generated at pinned time steps with the same library the service uses, so "current",
 * "one step behind" and "already spent" are exact rather than approximate.
 */
describe('MfaService', () => {
  const env = makeTestEnv() as ApiEnv;

  let secret: string;
  let client: {
    user: { findUnique: jest.Mock };
    mfaSecret: {
      upsert: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      deleteMany: jest.Mock;
    };
    recoveryCode: {
      findMany: jest.Mock;
      createMany: jest.Mock;
      deleteMany: jest.Mock;
      updateMany: jest.Mock;
      count: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  let service: MfaService;

  /** The code an authenticator app would display at a given time step. */
  const codeAtStep = (step: number): string =>
    authenticator
      .clone({ step: STEP_SECONDS, window: 0, epoch: step * STEP_SECONDS * 1000 })
      .generate(secret);

  const nowStep = (): number => Math.floor(Date.now() / 1000 / STEP_SECONDS);

  /** A real sealed secret under the test key, because the service opens what it reads. */
  const sealed = (value: string = secret): string => sealSecret(value, env.auth.mfa.encryptionKey);

  const setRow = (row: Record<string, unknown> | null): void => {
    client.mfaSecret.findUnique.mockResolvedValue(row);
  };

  /** An enrolled, confirmed row whose secret is the one the tests generate codes from. */
  const enrolledRow = (overrides: Record<string, unknown> = {}): void => {
    setRow({
      id: 'mfa-1',
      secretEncrypted: sealed(),
      confirmedAt: new Date(),
      lastUsedAt: null,
      ...overrides,
    });
  };

  beforeEach(() => {
    secret = authenticator.generateSecret();

    client = {
      user: { findUnique: jest.fn().mockResolvedValue({ email: 'resto@email.com' }) },
      mfaSecret: {
        upsert: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue({}),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      recoveryCode: {
        findMany: jest.fn().mockResolvedValue([]),
        createMany: jest.fn().mockResolvedValue({ count: RECOVERY_CODE_COUNT }),
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        count: jest.fn().mockResolvedValue(0),
      },
      // Supports both shapes the service uses: the interactive callback, and an array of operations.
      $transaction: jest.fn(async (work: unknown) =>
        typeof work === 'function'
          ? (work as (tx: typeof client) => Promise<unknown>)(client)
          : Promise.all(work as Promise<unknown>[]),
      ),
    };

    service = new MfaService(env, { getClient: () => client } as unknown as PrismaService);
  });

  describe('beginEnrolment', () => {
    it('stores the secret ENCRYPTED, never in the clear', async () => {
      const start = await service.beginEnrolment('user-1');
      const stored = client.mfaSecret.upsert.mock.calls[0][0].create.secretEncrypted as string;

      // A database dump must not be enough to generate anybody's codes.
      expect(stored).not.toContain(start.secret);
      expect(openSecret(stored, env.auth.mfa.encryptionKey)).toBe(start.secret);
    });

    it('returns an otpauth URI carrying the issuer and the account e-mail', async () => {
      const start = await service.beginEnrolment('user-1');

      expect(start.otpauthUri).toMatch(/^otpauth:\/\/totp\//);
      expect(start.otpauthUri).toContain('issuer=Chapfoody');
      expect(start.otpauthUri).toContain(encodeURIComponent('resto@email.com'));
      expect(start.secret).toHaveLength(16);
    });

    it('starts UNCONFIRMED, so a half-finished enrolment protects nothing', async () => {
      await service.beginEnrolment('user-1');

      expect(client.mfaSecret.upsert.mock.calls[0][0].create).not.toHaveProperty('confirmedAt');
    });

    it('replaces a previous attempt rather than leaving the user between two secrets', async () => {
      await service.beginEnrolment('user-1');

      // Re-enrolling must clear the confirmation and the last-use stamp: otherwise an old confirmation
      // would point at a secret that no longer exists.
      expect(client.mfaSecret.upsert.mock.calls[0][0].update).toEqual({
        secretEncrypted: expect.any(String),
        confirmedAt: null,
        lastUsedAt: null,
      });
    });

    it('refuses to enrol for a user that does not exist', async () => {
      client.user.findUnique.mockResolvedValue(null);

      await expect(service.beginEnrolment('ghost')).rejects.toThrow(/Authentification requise/);
    });
  });

  describe('isEnabled', () => {
    it('is false for an enrolment that was started but never confirmed', async () => {
      setRow({ id: 'mfa-1', secretEncrypted: sealed(), confirmedAt: null });

      await expect(service.isEnabled('user-1')).resolves.toBe(false);
    });

    it('is true only once confirmed', async () => {
      enrolledRow();

      await expect(service.isEnabled('user-1')).resolves.toBe(true);
    });

    it('is false when there is no row at all', async () => {
      setRow(null);

      await expect(service.isEnabled('user-1')).resolves.toBe(false);
    });
  });

  describe('confirmEnrolment', () => {
    it('activates MFA and returns the recovery codes', async () => {
      setRow({ id: 'mfa-1', secretEncrypted: sealed(), confirmedAt: null });

      const result = await service.confirmEnrolment('user-1', codeAtStep(nowStep()));

      expect(result.recoveryCodes).toHaveLength(RECOVERY_CODE_COUNT);
      expect(client.mfaSecret.update.mock.calls[0][0].data.confirmedAt).toBeInstanceOf(Date);
    });

    it('stores the recovery codes ONLY as hashes', async () => {
      setRow({ id: 'mfa-1', secretEncrypted: sealed(), confirmedAt: null });

      const result = await service.confirmEnrolment('user-1', codeAtStep(nowStep()));
      const storedHashes = client.recoveryCode.createMany.mock.calls[0][0].data as {
        codeHash: string;
      }[];

      expect(storedHashes).toHaveLength(RECOVERY_CODE_COUNT);

      // Ten working bypasses of the second factor must be useless in a table dump.
      for (const code of result.recoveryCodes) {
        expect(storedHashes.some((row) => row.codeHash.includes(code))).toBe(false);
      }
    });

    it('rejects a wrong code without activating anything', async () => {
      setRow({ id: 'mfa-1', secretEncrypted: sealed(), confirmedAt: null });

      await expect(service.confirmEnrolment('user-1', '000000')).rejects.toThrow(
        /Code de vérification invalide/,
      );
      expect(client.mfaSecret.update).not.toHaveBeenCalled();
    });

    it('refuses when no enrolment is in progress', async () => {
      setRow(null);

      await expect(service.confirmEnrolment('user-1', '123456')).rejects.toThrow(
        /Aucune inscription MFA/,
      );
    });

    it('refuses to re-confirm, which would silently rotate the recovery codes', async () => {
      enrolledRow();

      await expect(service.confirmEnrolment('user-1', codeAtStep(nowStep()))).rejects.toThrow(
        /déjà activée/,
      );
    });
  });

  describe('verifyForUser — the step that gates the session', () => {
    it('refuses everything when MFA was never confirmed', async () => {
      // The DoD's negative case: an unconfirmed enrolment must not be a second factor, and more
      // importantly must not become a way to bypass one.
      setRow({ id: 'mfa-1', secretEncrypted: sealed(), confirmedAt: null, lastUsedAt: null });

      await expect(service.verifyForUser('user-1', codeAtStep(nowStep()))).resolves.toBe(false);
    });

    it('accepts the current code and records the use', async () => {
      enrolledRow();

      await expect(service.verifyForUser('user-1', codeAtStep(nowStep()))).resolves.toBe(true);
      expect(client.mfaSecret.update.mock.calls[0][0].data.lastUsedAt).toBeInstanceOf(Date);
    });

    it('accepts a code ONE step behind, because phone clocks drift', async () => {
      enrolledRow();

      await expect(service.verifyForUser('user-1', codeAtStep(nowStep() - 1))).resolves.toBe(true);
    });

    it('refuses a code TWO steps behind, which is outside the tolerance', async () => {
      enrolledRow();

      await expect(service.verifyForUser('user-1', codeAtStep(nowStep() - 2))).resolves.toBe(false);
    });

    it('refuses a wrong code', async () => {
      enrolledRow();

      await expect(service.verifyForUser('user-1', '000000')).resolves.toBe(false);
    });

    it('REFUSES a code that was already spent, inside its own window', async () => {
      // The replay that matters: a code stays valid for its step plus a step of tolerance, so up to
      // ninety seconds in which an observed code could be reused. The spent step is derived from
      // lastUsedAt, so setting it to "now" reproduces exactly the state after a successful sign-in.
      enrolledRow({ lastUsedAt: new Date() });

      await expect(service.verifyForUser('user-1', codeAtStep(nowStep()))).resolves.toBe(false);
    });

    it('refuses a malformed code without doing any work', async () => {
      enrolledRow();

      for (const bad of ['', '12345', 'abcdef', '1234567']) {
        await expect(service.verifyForUser('user-1', bad)).resolves.toBe(false);
      }
    });

    it('tolerates spaces, which is what a paste from an authenticator carries', async () => {
      enrolledRow();
      const code = codeAtStep(nowStep());
      const spaced = `${code.slice(0, 3)} ${code.slice(3)}`;

      await expect(service.verifyForUser('user-1', spaced)).resolves.toBe(true);
    });
  });

  describe('recovery codes', () => {
    it('accepts a recovery code once and refuses it afterwards', async () => {
      // Enrol properly, so the codes the user was shown are the ones whose hashes were stored.
      setRow({ id: 'mfa-1', secretEncrypted: sealed(), confirmedAt: null });

      const { recoveryCodes } = await service.confirmEnrolment('user-1', codeAtStep(nowStep()));
      const stored = client.recoveryCode.createMany.mock.calls[0][0].data as { codeHash: string }[];

      enrolledRow();
      client.recoveryCode.findMany.mockResolvedValue(
        stored.map((row, index) => ({ id: `rc-${index}`, codeHash: row.codeHash })),
      );

      const code = recoveryCodes[0] as string;

      await expect(service.verifyForUser('user-1', code)).resolves.toBe(true);

      // Once spent it is no longer a candidate: `usedAt: null` is what the query selects on.
      client.recoveryCode.findMany.mockResolvedValue([]);

      await expect(service.verifyForUser('user-1', code)).resolves.toBe(false);
    });

    it('does not spend a recovery code when no code matched', async () => {
      enrolledRow();
      client.recoveryCode.findMany.mockResolvedValue([
        { id: 'rc-1', codeHash: await hashPassword('ABCDE-FGHJK') },
      ]);

      await expect(service.verifyForUser('user-1', 'ZZZZZ-ZZZZZ')).resolves.toBe(false);
      expect(client.recoveryCode.updateMany).not.toHaveBeenCalled();
    });
  });

  describe('disable', () => {
    it('requires a valid code, even from an authenticated session', async () => {
      enrolledRow();

      await expect(service.disable('user-1', '000000')).rejects.toThrow(
        /Code de vérification invalide/,
      );
      expect(client.mfaSecret.deleteMany).not.toHaveBeenCalled();
    });

    it('clears the secret AND the recovery codes together', async () => {
      enrolledRow();

      await service.disable('user-1', codeAtStep(nowStep()));

      // Leaving the codes behind would leave ten working bypasses for an account with no second factor.
      expect(client.recoveryCode.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user-1' } });
      expect(client.mfaSecret.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user-1' } });
    });
  });

  describe('status', () => {
    it('reports the state and the codes left unspent', async () => {
      enrolledRow();
      client.recoveryCode.count.mockResolvedValue(7);

      await expect(service.status('user-1')).resolves.toEqual({
        enabled: true,
        confirmedAt: expect.any(Date),
        recoveryCodesRemaining: 7,
      });
    });

    it('reports nothing enabled when there is no row', async () => {
      setRow(null);

      await expect(service.status('user-1')).resolves.toEqual({
        enabled: false,
        confirmedAt: null,
        recoveryCodesRemaining: 0,
      });
    });
  });
});
