import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto';

/**
 * Symmetric encryption for the few secrets that must be readable again.
 *
 * ── Why this exists rather than hashing ──────────────────────────────────────
 * Passwords are hashed and never come back. A TOTP secret cannot be treated that way: verifying a code
 * means recomputing it, which needs the secret. So it is encrypted, and the key lives in the
 * environment rather than in the database — which is the whole point: a database dump alone is then not
 * enough to generate anybody's codes.
 *
 * ── Why AES-256-GCM ──────────────────────────────────────────────────────────
 * GCM is authenticated: tampering with the stored value makes decryption FAIL rather than return
 * plausible rubbish. With a plain CBC mode an attacker with write access could flip bits and we would
 * happily use the result. The auth tag is stored alongside the ciphertext.
 *
 * ── The key derivation ───────────────────────────────────────────────────────
 * `scryptSync` over the environment value with a fixed salt. A bare hash of a passphrase is cheap to
 * brute-force; scrypt is not. The salt is fixed and public because there is exactly one secret here —
 * deriving per-row would mean storing a salt per row for no additional property.
 *
 * The derivation is memoised: scrypt is deliberately expensive and this runs on every MFA verification,
 * but the key is the same every time. It is derived once per process.
 *
 * ── Format ───────────────────────────────────────────────────────────────────
 *   v1.<iv base64url>.<ciphertext base64url>.<tag base64url>
 * The version is first so the format can change later without guessing at old rows.
 */

const VERSION = 'v1';
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const SALT = 'chapfoody:secret-box:v1';

export class SecretBoxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecretBoxError';
  }
}

/** Memoised keys, so scrypt runs once per distinct key material per process. */
const keyCache = new Map<string, Buffer>();

function deriveKey(keyMaterial: string): Buffer {
  const cached = keyCache.get(keyMaterial);

  if (cached !== undefined) {
    return cached;
  }

  const key = scryptSync(keyMaterial, SALT, KEY_LENGTH);
  keyCache.set(keyMaterial, key);

  return key;
}

/** Encrypts a secret for storage. */
export function sealSecret(plaintext: string, keyMaterial: string): string {
  const key = deriveKey(keyMaterial);
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [
    VERSION,
    iv.toString('base64url'),
    ciphertext.toString('base64url'),
    tag.toString('base64url'),
  ].join('.');
}

/**
 * Decrypts a stored secret.
 *
 * Throws `SecretBoxError` on anything malformed, truncated, tampered with, or encrypted under a
 * DIFFERENT key — which is what happens when the environment's key is rotated without re-encrypting
 * the rows, and is exactly the failure an operator needs to see named rather than as a TypeError.
 */
export function openSecret(sealed: string, keyMaterial: string): string {
  const parts = sealed.split('.');

  if (parts.length !== 4 || parts[0] !== VERSION) {
    throw new SecretBoxError('Encrypted value is not in the expected v1 format.');
  }

  const [, ivPart, ciphertextPart, tagPart] = parts as [string, string, string, string];

  const key = deriveKey(keyMaterial);
  const iv = Buffer.from(ivPart, 'base64url');
  const tag = Buffer.from(tagPart, 'base64url');

  if (iv.length !== IV_LENGTH || tag.length !== 16) {
    throw new SecretBoxError('Encrypted value has a malformed initialisation vector or tag.');
  }

  try {
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    return Buffer.concat([
      decipher.update(Buffer.from(ciphertextPart, 'base64url')),
      decipher.final(),
    ]).toString('utf8');
  } catch {
    // GCM cannot tell a wrong key from a tampered ciphertext, and neither should the caller: both mean
    // "this value is not usable", and naming the difference would be a decryption oracle.
    throw new SecretBoxError('Encrypted value could not be opened (wrong key, or tampered with).');
  }
}

/**
 * Constant-time comparison for short secrets a user types.
 *
 * `===` on strings leaks how much of a guess matched, one character at a time. Over a network that is
 * usually theoretical, and for a recovery code it is free to avoid.
 */
export function secretsMatch(a: string, b: string): boolean {
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');

  // `timingSafeEqual` throws on different lengths, and padding first would compare padding rather than
  // content — so unequal lengths are simply not a match.
  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}
