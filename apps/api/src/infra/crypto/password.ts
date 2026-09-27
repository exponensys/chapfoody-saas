import type { Algorithm } from '@node-rs/argon2';
import { hash, verify } from '@node-rs/argon2';

/**
 * Password hashing — Argon2id.
 *
 * ── Why Argon2id and not bcrypt or scrypt ────────────────────────────────────
 * Argon2id won the Password Hashing Competition and is the OWASP first choice: it is
 * memory-hard, so a GPU or ASIC cannot trade memory for parallelism the way it can
 * against bcrypt, and its hybrid mode resists both side-channel and trade-off attacks.
 *
 * ── Why these parameters ─────────────────────────────────────────────────────
 * 19 MiB / 2 iterations / 1 lane is the OWASP minimum for Argon2id (the "second
 * recommended" configuration), and it is `@node-rs/argon2`'s own default. Chosen over
 * 46 MiB / 1 iteration because the smaller footprint matters when several logins land on
 * the same small API instance at once — a saturated memory cost is its own denial of
 * service.
 *
 * Parameters are encoded in the hash string itself (`$argon2id$v=19$m=19456,t=2,p=1$…`),
 * so raising them later does not invalidate existing hashes: old ones keep verifying
 * with their own recorded cost, and can be upgraded on next successful sign-in.
 */

/**
 * Argon2id, as `Algorithm` declares it in @node-rs/argon2's types.
 *
 * Spelled as a literal because that enum is *ambient* (`declare const enum`), and
 * referencing an ambient const enum's value is forbidden while `isolatedModules` is on.
 * The type import above keeps the annotation honest, so a change in the library breaks
 * this line rather than silently switching to a weaker variant.
 */
const ARGON2ID = 2 as Algorithm;

const ARGON2ID_OPTIONS = {
  algorithm: ARGON2ID,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
} as const;

/** Hashes a plaintext password for storage. */
export function hashPassword(plaintext: string): Promise<string> {
  return hash(plaintext, ARGON2ID_OPTIONS);
}

/**
 * Verifies a password against a stored hash.
 *
 * Returns `false` rather than throwing on a malformed or truncated hash: a corrupt row
 * must read as "wrong password", not as a 500 that tells an attacker they found
 * something interesting.
 */
export async function verifyPassword(storedHash: string, plaintext: string): Promise<boolean> {
  try {
    return await verify(storedHash, plaintext, ARGON2ID_OPTIONS);
  } catch {
    return false;
  }
}
