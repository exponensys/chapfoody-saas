import { createHash } from 'node:crypto';

import { Injectable, Logger } from '@nestjs/common';

import { withTimeout } from '../../common/async/with-timeout.js';

/**
 * Refuses passwords known to be in a breach corpus, without ever sending the password anywhere.
 *
 * ── k-anonymity, and why SHA-1 is involved ───────────────────────────────────
 * The password is hashed with SHA-1 and only the FIRST FIVE HEX CHARACTERS are sent. The service answers
 * with every suffix it holds for that prefix — around 800 of them — and the match is done locally. The
 * server learns "somebody asked about these five characters", which is worthless on its own, and never
 * sees the hash or the password.
 *
 * SHA-1 here is an INDEX into a public, already-known corpus, not a security primitive. Its collision
 * weaknesses are irrelevant: nobody is forging anything, and the corpus is the same one an attacker
 * already has. This is the one place in the codebase where SHA-1 is the right tool, so it is worth
 * saying out loud rather than leaving it to look like a mistake.
 *
 * ── It fails OPEN, deliberately ──────────────────────────────────────────────
 * If the lookup cannot be completed — HIBP is down, the network is slow, a corporate proxy interferes —
 * the password is ACCEPTED and a warning is logged. The alternative is that an outage at a third party
 * stops every registration in the product, and the blocklist is a defence-in-depth measure on top of a
 * twelve-character minimum rather than the thing holding the door shut. A service that cannot sign
 * anybody up because somebody else's API is unreachable is a worse failure than a weak password getting
 * through during that window.
 */
@Injectable()
export class BreachedPasswordService {
  private readonly logger = new Logger(BreachedPasswordService.name);

  /**
   * How long the lookup may take.
   *
   * This is on the registration path, so it is a latency budget as much as a safety net: a hang here is a
   * hang the user experiences as "the sign-up button does nothing".
   *
   * ── Why this is a field and NOT a constructor parameter ─────────────────────
   * Nest treats every constructor parameter as a dependency to inject, so a primitive there makes the
   * container try to resolve `number` — and it fails at START-UP with "can't resolve dependencies of
   * BreachedPasswordService", which names this service rather than the parameter. The unit tests
   * constructed the class directly and never saw it; the e2e suite, which boots the real module, failed
   * on the first run. A field with a default keeps the seam a test can move without asking the container
   * for arithmetic.
   */
  timeoutMs = 1_500;

  /** Whether the password appears in a known breach corpus. */
  async isBreached(password: string): Promise<boolean> {
    const { prefix, suffix } = toRangeKey(password);

    try {
      const response = await withTimeout(
        fetch(`${HIBP_RANGE_URL}/${prefix}`, {
          headers: {
            // Adds entries with a count of 0 so the RESPONSE SIZE does not leak how many real hashes
            // share the prefix. Because of that, a match must be checked for a non-zero count — see
            // below.
            'Add-Padding': 'true',
            'User-Agent': 'chapfoody-api',
          },
        }),
        this.timeoutMs,
        'Breached-password lookup timed out',
      );

      if (!response.ok) {
        this.logger.warn(
          `Breached-password lookup returned ${response.status}; allowing the password.`,
        );

        return false;
      }

      return parseRangeBody(await response.text(), suffix);
    } catch (error) {
      // Fail open, loudly. See the class comment: a third party's outage must not stop registrations.
      this.logger.warn(
        `Breached-password lookup failed (${error instanceof Error ? error.message : String(error)}); allowing the password.`,
      );

      return false;
    }
  }
}

const HIBP_RANGE_URL = 'https://api.pwnedpasswords.com/range';

/**
 * Splits the SHA-1 into the part that is sent and the part that stays here.
 *
 * Upper-case hex because that is the encoding the corpus uses; sending lower-case is a valid request for
 * a range nobody has ever asked about, and it silently returns no matches.
 */
export function toRangeKey(password: string): { prefix: string; suffix: string } {
  const digest = createHash('sha1').update(password, 'utf8').digest('hex').toUpperCase();

  return { prefix: digest.slice(0, 5), suffix: digest.slice(5) };
}

/**
 * Looks for the suffix in an HIBP range response.
 *
 * The count matters. With `Add-Padding`, the response contains entries with a count of 0 that exist only
 * to conceal the real size — treating their presence as a match would report random passwords as
 * breached, which is the kind of false positive that makes a security feature get switched off.
 */
export function parseRangeBody(body: string, suffix: string): boolean {
  for (const line of body.split('\n')) {
    const separator = line.indexOf(':');

    if (separator === -1) {
      continue;
    }

    if (line.slice(0, separator).trim() !== suffix) {
      continue;
    }

    const count = Number.parseInt(line.slice(separator + 1).trim(), 10);

    return Number.isFinite(count) && count > 0;
  }

  return false;
}
