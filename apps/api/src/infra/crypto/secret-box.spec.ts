import { openSecret, sealSecret, SecretBoxError, secretsMatch } from './secret-box.js';

/**
 * The encryption that protects secrets which have to be readable again.
 *
 * Passwords are hashed and never come back; a TOTP secret cannot be, because verifying a code means
 * recomputing it. So it is encrypted under a key from the environment, and a database dump alone is not
 * enough to generate anybody's codes.
 */
describe('secret box', () => {
  const key = 'a-test-key-material-for-the-secret-box';

  it('round-trips a value', () => {
    const sealed = sealSecret('JBSWY3DPEHPK3PXP', key);

    expect(sealed).not.toContain('JBSWY3DPEHPK3PXP');
    expect(openSecret(sealed, key)).toBe('JBSWY3DPEHPK3PXP');
  });

  it('produces a DIFFERENT ciphertext every time for the same input', () => {
    // A fresh IV per seal. Deterministic output would let anyone with database read access see that two
    // users hold the same secret — and, worse, recognise a known value without decrypting it.
    const first = sealSecret('same-secret', key);
    const second = sealSecret('same-secret', key);

    expect(first).not.toBe(second);
    expect(openSecret(first, key)).toBe(openSecret(second, key));
  });

  it('is versioned, so the format can change without guessing at old rows', () => {
    expect(sealSecret('x', key).startsWith('v1.')).toBe(true);
  });

  it('refuses a value encrypted under a DIFFERENT key', () => {
    // What happens when the environment key is rotated without re-encrypting the rows: it must fail
    // with something an operator can act on, not silently return rubbish.
    const sealed = sealSecret('JBSWY3DPEHPK3PXP', key);

    expect(() => openSecret(sealed, 'a-different-key')).toThrow(SecretBoxError);
    expect(() => openSecret(sealed, 'a-different-key')).toThrow(/wrong key, or tampered/);
  });

  it('detects TAMPERING rather than returning plausible rubbish', () => {
    // The property a plain CBC mode would not give: flipping a bit in the ciphertext must fail the auth
    // tag check rather than decrypt to something else.
    const sealed = sealSecret('JBSWY3DPEHPK3PXP', key);
    const [version, iv, ciphertext, tag] = sealed.split('.');

    const flipped = Buffer.from(ciphertext as string, 'base64url');
    flipped[0] = (flipped[0] as number) ^ 0x01;

    const tampered = [version, iv, flipped.toString('base64url'), tag].join('.');

    expect(() => openSecret(tampered, key)).toThrow(SecretBoxError);
  });

  it('refuses a malformed value instead of throwing something unhelpful', () => {
    for (const bad of ['', 'not-sealed', 'v1.only.three', 'v2.a.b.c']) {
      expect(() => openSecret(bad, key)).toThrow(SecretBoxError);
    }
  });

  it('handles an empty secret and unicode', () => {
    expect(openSecret(sealSecret('', key), key)).toBe('');
    expect(openSecret(sealSecret('sécret-étoile-⭐', key), key)).toBe('sécret-étoile-⭐');
  });
});

describe('secretsMatch', () => {
  it('matches equal strings and rejects different ones', () => {
    expect(secretsMatch('abc123', 'abc123')).toBe(true);
    expect(secretsMatch('abc123', 'abc124')).toBe(false);
  });

  it('rejects different lengths without throwing', () => {
    // `timingSafeEqual` throws on length mismatch; padding first would compare padding rather than
    // content, so an unequal length is simply not a match.
    expect(secretsMatch('abc', 'abcdef')).toBe(false);
    expect(secretsMatch('', 'a')).toBe(false);
    expect(secretsMatch('', '')).toBe(true);
  });
});
