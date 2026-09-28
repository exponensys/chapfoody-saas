import { randomBytes } from 'node:crypto';

import { Inject, Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';

import { AppException } from '../../common/errors/app.exception.js';
import type { ApiEnv } from '../../config/env.js';
import { API_ENV } from '../../config/env.token.js';
import { hashPassword, verifyPassword } from '../../infra/crypto/password.js';
import { openSecret, sealSecret, secretsMatch } from '../../infra/crypto/secret-box.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';

export interface EnrolmentStart {
  /** The base32 secret, for an authenticator that cannot read the URI. Shown once, never again. */
  secret: string;
  /** The `otpauth://` URI the client renders as a QR code. */
  otpauthUri: string;
}

export interface EnrolmentConfirmation {
  /**
   * The recovery codes, in the clear, ONCE.
   *
   * Only hashes are stored, so there is no way to produce these again — which is the intended
   * property: a database leak must not hand over ten working bypasses.
   */
  recoveryCodes: string[];
}

export interface MfaStatus {
  enabled: boolean;
  confirmedAt: Date | null;
  recoveryCodesRemaining: number;
}

/** One time step, in seconds. RFC 6238's default, and what every authenticator app assumes. */
const STEP_SECONDS = 30;

/**
 * How many steps either side of now a code is accepted.
 *
 * One step is the usual compromise. A phone's clock drifts, and the alternative to tolerating a step is
 * telling a user their correct code is wrong. Two steps each way would accept a code for a minute and a
 * half, which starts to make a shoulder-surfed code genuinely useful to an attacker.
 *
 * Expressed in steps rather than seconds because otplib's `window` is a count of steps, and because the
 * replay check below is per step — mixing the two units is how a tolerance silently becomes twice what
 * was intended.
 */
const TOLERANCE_STEPS = 1;

/**
 * A TOTP code is six digits by default, and enumerating steps costs an HMAC each.
 *
 * Checked up front so obvious junk — an empty box, a truncated paste — is refused before any hashing,
 * and so the enumeration below can assume a well-formed input.
 */
const TOTP_CODE_PATTERN = /^\d{6}$/;

export const RECOVERY_CODE_COUNT = 10;

/**
 * A recovery code: five random bytes as base32-ish text, in two groups.
 *
 * 40 bits, single-use, and shaped to be read aloud and typed — the situation it exists for is a lost
 * phone, often while somebody is on a call. Ambiguous characters (0/O, 1/I) are excluded for the same
 * reason.
 */
function generateRecoveryCode(): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTVWXYZ23456789';
  const bytes = randomBytes(10);

  const characters = [...bytes].map((byte) => alphabet[byte % alphabet.length] as string);

  return `${characters.slice(0, 5).join('')}-${characters.slice(5).join('')}`;
}

/**
 * TOTP enrolment and verification.
 *
 * ── The secret is encrypted, not hashed ──────────────────────────────────────
 * A password is hashed and never comes back. A TOTP secret cannot be: verifying a code means
 * recomputing it, so the secret must be readable — which is why it is sealed with a key held in the
 * environment rather than in the database. A dump of the table alone is then not enough to generate
 * anybody's codes.
 *
 * ── Enrolment is not complete until a code proves it ─────────────────────────
 * `beginEnrolment` stores a secret with `confirmedAt` null, and nothing else in the system treats it as
 * enabled. Without that split, a user who scanned the QR and closed the tab would be locked out of an
 * account they never finished protecting — and the recovery codes would not exist yet.
 *
 * ── A code cannot be replayed ────────────────────────────────────────────────
 * Because a code is valid for its window plus the tolerance, an attacker who observes one has up to
 * ninety seconds to use it. `afterTimeStep` rejects any step already spent, so the second use of the
 * same code fails even inside its own window.
 */
@Injectable()
export class MfaService {
  constructor(
    @Inject(API_ENV) private readonly env: ApiEnv,
    private readonly prisma: PrismaService,
  ) {}

  /** Starts enrolment. Any previous unconfirmed attempt is replaced. */
  async beginEnrolment(userId: string): Promise<EnrolmentStart> {
    const user = await this.prisma.getClient().user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (user === null) {
      throw AppException.unauthenticated('Authentification requise.');
    }

    const secret = authenticator.generateSecret();
    const sealed = sealSecret(secret, this.env.auth.mfa.encryptionKey);

    await this.prisma.getClient().mfaSecret.upsert({
      where: { userId },
      create: { userId, secretEncrypted: sealed },
      // Re-enrolling replaces the secret and clears the confirmation, so a half-finished enrolment can
      // always be restarted rather than leaving a user stuck between two secrets.
      update: { secretEncrypted: sealed, confirmedAt: null, lastUsedAt: null },
    });

    return {
      secret,
      // The account name in the authenticator's list is the e-mail: it is what a person recognises when
      // they have three entries all called "Chapfoody".
      otpauthUri: authenticator.keyuri(user.email, this.env.auth.mfa.issuer, secret),
    };
  }

  /**
   * Completes enrolment, once a code proves the authenticator holds the secret.
   *
   * Returns the recovery codes in the clear, and this is the ONLY time they exist outside a hash. The
   * caller must show them; there is deliberately no endpoint that can produce them again.
   */
  async confirmEnrolment(userId: string, code: string): Promise<EnrolmentConfirmation> {
    const stored = await this.prisma.getClient().mfaSecret.findUnique({
      where: { userId },
      select: { id: true, secretEncrypted: true, confirmedAt: true },
    });

    if (stored === null) {
      throw AppException.forbidden('Aucune inscription MFA en cours. Commencez par en générer une.');
    }

    if (stored.confirmedAt !== null) {
      // Re-confirming would rotate the recovery codes by accident, and a user who has filed them away
      // would silently lose every one.
      throw AppException.forbidden('La double authentification est déjà activée.');
    }

    const secret = openSecret(stored.secretEncrypted, this.env.auth.mfa.encryptionKey);

    if (!this.verifyTotp(secret, code)) {
      throw AppException.unauthenticated('Code de vérification invalide.');
    }

    const recoveryCodes = Array.from({ length: RECOVERY_CODE_COUNT }, generateRecoveryCode);

    // Hashed with Argon2id, exactly like passwords: these are ten working bypasses of the second
    // factor, so the table has to be useless on its own.
    const hashes = await Promise.all(recoveryCodes.map((recoveryCode) => hashPassword(recoveryCode)));

    await this.prisma.getClient().$transaction(async (tx) => {
      await tx.mfaSecret.update({
        where: { id: stored.id },
        data: { confirmedAt: new Date(), lastUsedAt: new Date() },
      });

      // Any previous set is dropped: codes issued for an older secret must not survive it.
      await tx.recoveryCode.deleteMany({ where: { userId } });
      await tx.recoveryCode.createMany({
        data: hashes.map((codeHash) => ({ userId, codeHash })),
      });
    });

    return { recoveryCodes };
  }

  /** Whether the account is actually protected — confirmed, not merely started. */
  async isEnabled(userId: string): Promise<boolean> {
    const stored = await this.prisma.getClient().mfaSecret.findUnique({
      where: { userId },
      select: { confirmedAt: true },
    });

    return stored !== null && stored.confirmedAt !== null;
  }

  /**
   * Verifies a second factor: a TOTP code, or failing that a recovery code.
   *
   * Recovery codes are tried SECOND on purpose. A wrong TOTP code is the common case — a typo, a clock
   * that has drifted — and checking ten Argon2 hashes before rejecting it would add a third of a second
   * to every ordinary mistake.
   */
  async verifyForUser(userId: string, code: string): Promise<boolean> {
    const stored = await this.prisma.getClient().mfaSecret.findUnique({
      where: { userId },
      select: { secretEncrypted: true, confirmedAt: true, lastUsedAt: true },
    });

    if (stored === null || stored.confirmedAt === null) {
      return false;
    }

    const secret = openSecret(stored.secretEncrypted, this.env.auth.mfa.encryptionKey);

    if (this.verifyTotp(secret, code, stored.lastUsedAt)) {
      await this.prisma
        .getClient()
        .mfaSecret.update({ where: { userId }, data: { lastUsedAt: new Date() } })
        // Best-effort: failing to record the use must not reject a code that just verified, and the
        // window this protects is thirty seconds wide.
        .catch(() => undefined);

      return true;
    }

    return this.consumeRecoveryCode(userId, code);
  }

  /** Turns MFA off, and clears the recovery codes with it. */
  async disable(userId: string, code: string): Promise<void> {
    // The code is required even from an authenticated session: turning the second factor OFF is exactly
    // what a hijacked session would want to do, so it costs a proof that the holder still has the
    // device.
    if (!(await this.verifyForUser(userId, code))) {
      throw AppException.unauthenticated('Code de vérification invalide.');
    }

    await this.prisma.getClient().$transaction([
      this.prisma.getClient().recoveryCode.deleteMany({ where: { userId } }),
      this.prisma.getClient().mfaSecret.deleteMany({ where: { userId } }),
    ]);
  }

  async status(userId: string): Promise<MfaStatus> {
    const client = this.prisma.getClient();

    const [stored, remaining] = await Promise.all([
      client.mfaSecret.findUnique({ where: { userId }, select: { confirmedAt: true } }),
      client.recoveryCode.count({ where: { userId, usedAt: null } }),
    ]);

    return {
      enabled: stored !== null && stored.confirmedAt !== null,
      confirmedAt: stored?.confirmedAt ?? null,
      recoveryCodesRemaining: remaining,
    };
  }

  /**
   * Verifies a TOTP code, returning whether it is valid AND unspent.
   *
   * ── Why the steps are enumerated rather than a library `verify()` called ─────
   * A plain "is this code correct right now" answer is not enough here, because a code stays valid for
   * its window plus the tolerance — up to ninety seconds in which an observed code can be replayed.
   * Closing that needs to know WHICH time step the code belongs to, and otplib's `checkDelta` does not
   * expose it reliably (it reads the secret from instance options, which `clone()` does not carry).
   *
   * Generating the code for a pinned step does work, so the steps are walked explicitly. That yields the
   * matched step, and with it the replay check — the same property `afterTimeStep` gives in otplib 13,
   * reached by a route that is verifiable against the library actually installed.
   *
   * The comparison is constant-time: a string `===` on a six-digit code leaks how much of a guess
   * matched, and `secretsMatch` costs nothing.
   */
  private verifyTotp(secret: string, code: string, lastUsedAt?: Date | null): boolean {
    const token = code.replace(/\s/g, '');

    if (!TOTP_CODE_PATTERN.test(token)) {
      return false;
    }

    const currentStep = Math.floor(Date.now() / 1000 / STEP_SECONDS);

    // The step the last accepted code belonged to, derived from the timestamp rather than stored
    // separately: two columns saying the same thing is two columns that can disagree.
    const spentStep =
      lastUsedAt === undefined || lastUsedAt === null
        ? null
        : Math.floor(lastUsedAt.getTime() / 1000 / STEP_SECONDS);

    // Newest step first. A code is refused if its step has already been spent, which is what stops the
    // same code being presented twice inside its own window.
    for (let offset = TOLERANCE_STEPS; offset >= -TOLERANCE_STEPS; offset -= 1) {
      const step = currentStep + offset;

      if (spentStep !== null && step <= spentStep) {
        continue;
      }

      if (secretsMatch(this.codeForStep(secret, step), token)) {
        return true;
      }
    }

    return false;
  }

  /**
   * The code an authenticator app would display for a given time step.
   *
   * The epoch is pinned explicitly through the options, which is what makes the step the caller asks for
   * the step it gets — `generate(secret)` alone always means "now".
   */
  private codeForStep(secret: string, step: number): string {
    return authenticator
      .clone({ step: STEP_SECONDS, window: 0, epoch: step * STEP_SECONDS * 1000 })
      .generate(secret);
  }

  /**
   * Finds and spends a recovery code.
   *
   * Every unused code is checked, because they are hashed and there is nothing to look one up by. That
   * is the cost of not storing them in a form that could be looked up, and it is paid only on the path
   * where a TOTP code has already failed.
   */
  private async consumeRecoveryCode(userId: string, code: string): Promise<boolean> {
    const normalised = code.trim().toUpperCase();

    const candidates = await this.prisma.getClient().recoveryCode.findMany({
      where: { userId, usedAt: null },
      select: { id: true, codeHash: true },
    });

    for (const candidate of candidates) {
      if (!(await verifyPassword(candidate.codeHash, normalised))) {
        continue;
      }

      // The `usedAt: null` in the WHERE clause is what makes a concurrent double-use spend the code
      // only once: the second update matches nothing rather than succeeding anyway.
      const spent = await this.prisma.getClient().recoveryCode.updateMany({
        where: { id: candidate.id, usedAt: null },
        data: { usedAt: new Date() },
      });

      return spent.count === 1;
    }

    return false;
  }
}
