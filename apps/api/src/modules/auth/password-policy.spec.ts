import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  checkPasswordPolicy,
  personalTerms,
} from './password-policy.js';

/**
 * The password policy.
 *
 * The tests that matter here are the ones asserting what is NOT required — no uppercase, no digit, no
 * symbol — because those rules are the default assumption and their absence looks like an oversight
 * until it is explained. A passphrase of lowercase words with spaces must pass, and that is asserted by
 * name.
 */
describe('checkPasswordPolicy', () => {
  it('accepts a lowercase passphrase with spaces, which composition rules would reject', () => {
    // The point of the policy: this is both stronger and more memorable than `Password1!`.
    expect(checkPasswordPolicy('correct horse battery staple')).toBeNull();
  });

  it('accepts spaces, punctuation and non-Latin scripts', () => {
    for (const password of [
      'une phrase de passe correcte',
      '   leading and trailing spaces   ',
      'пароль из двенадцати',
      'パスワードは十二文字です',
      'a1!B2@c3#D4$e5%',
    ]) {
      expect(checkPasswordPolicy(password)).toBeNull();
    }
  });

  it('requires the minimum length, counting characters rather than bytes', () => {
    expect(checkPasswordPolicy('a'.repeat(MIN_PASSWORD_LENGTH - 1))).toMatch(/au moins 12/);
    expect(checkPasswordPolicy('a'.repeat(MIN_PASSWORD_LENGTH))).toBeNull();
    // Twelve characters, but twenty-four bytes: the rule is about characters the user typed.
    expect(checkPasswordPolicy('粗'.repeat(12))).toBeNull();
  });

  it('caps the length as a denial-of-service guard, not as a policy', () => {
    // Unbounded input to a memory-hard hash is a cheap way to make the server do expensive work.
    expect(checkPasswordPolicy('a'.repeat(MAX_PASSWORD_LENGTH + 1))).toMatch(/au plus 200|ne doit pas dépasser/);
    expect(checkPasswordPolicy('a'.repeat(MAX_PASSWORD_LENGTH))).toBeNull();
  });

  it('refuses a password that is nothing but whitespace', () => {
    expect(checkPasswordPolicy('             ')).toMatch(/uniquement d’espaces/);
  });

  it('refuses the user’s own name or address', () => {
    const context = { email: 'resto@email.com', firstName: 'Fatou', lastName: 'Diallo' };

    // These are the first guesses against a targeted account, and no length rule helps with them.
    expect(checkPasswordPolicy('resto-is-my-password', context)).toMatch(/votre nom/);
    expect(checkPasswordPolicy('my-name-is-fatou-ok', context)).toMatch(/votre nom/);
    expect(checkPasswordPolicy('diallo-and-sons-ltd', context)).toMatch(/votre nom/);
  });

  it('matches personal terms case-insensitively', () => {
    expect(checkPasswordPolicy('FATOU-is-my-name', { firstName: 'fatou' })).toMatch(/votre nom/);
  });

  it('ignores personal terms shorter than four characters', () => {
    // Two competing costs, and this is the side worth erring on: a three-letter name like "Awa" would
    // otherwise reject `awaiting-the-boat` for somebody who is not called that. Over-rejecting valid
    // passwords is what pushes people towards worse ones, so short terms are not used as context.
    expect(checkPasswordPolicy('something-ng-something', { lastName: 'Ng' })).toBeNull();
    expect(checkPasswordPolicy('awaiting-the-boat', { firstName: 'Awa' })).toBeNull();
  });

  it('needs no configuration at all', () => {
    expect(checkPasswordPolicy('a-perfectly-long-secret', {})).toBeNull();
    expect(checkPasswordPolicy('a-perfectly-long-secret')).toBeNull();
  });

  describe('personalTerms', () => {
    it('takes the local part of the address, not the whole address', () => {
      // People type `resto` far more often than `resto@email.com`, and `@` is not what makes it guessable.
      expect(personalTerms({ email: 'resto@email.com' })).toContain('resto');
      expect(personalTerms({ email: 'resto@email.com' })).not.toContain('resto@email.com');
    });

    it('drops missing and too-short terms rather than returning blanks', () => {
      expect(personalTerms({ firstName: 'Fatou', lastName: undefined })).toEqual(['fatou']);
      expect(personalTerms({})).toEqual([]);
    });
  });
});
