/**
 * The password policy.
 *
 * ── NIST SP 800-63B, not the rules everybody reaches for ─────────────────────
 * There are deliberately NO composition rules. Requiring an uppercase letter, a digit and a symbol
 * reliably produces `Password1!`: it narrows the space of passwords people actually choose rather than
 * widening it, and it makes them harder to remember and easier to guess. NIST withdrew the advice in
 * 2017, and the reasoning has held up since.
 *
 * What replaces it is LENGTH plus a BLOCKLIST:
 *   • a minimum of 12 characters, above NIST's floor of 8, because this product holds a business's
 *     money and its customers' data;
 *   • every character is allowed, including spaces and non-Latin scripts, so a passphrase or a phrase in
 *     the user's own language is a first-class option rather than something to be rejected;
 *   • anything known to be breached is refused, which is what actually catches `Password1!`;
 *   • the user's own name and address are refused, because those are the first guesses against a
 *     targeted account and no length rule can help with them.
 *
 * The upper bound is not a policy — it is a denial-of-service guard. Argon2id is memory-hard, so an
 * unbounded password is a cheap way to make the server do expensive work.
 */

export const MIN_PASSWORD_LENGTH = 12;

/**
 * Above NIST's suggested floor of 64 so that passphrases are never truncated by policy. The bound exists
 * only so a megabyte "password" cannot be fed to Argon2.
 */
export const MAX_PASSWORD_LENGTH = 200;

/** The shortest personal term worth refusing, so a two-letter surname does not reject everything. */
const MIN_PERSONAL_TERM_LENGTH = 4;

export interface PasswordContext {
  email?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
}

/**
 * Checks a password against the parts of the policy that need no network.
 *
 * Returns `null` when acceptable, or a message to show the user. A message rather than a boolean because
 * "your password is not acceptable" tells somebody nothing about what to change, and the reasons here are
 * all things they can act on.
 */
export function checkPasswordPolicy(
  password: string,
  context: PasswordContext = {},
): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`;
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Le mot de passe ne doit pas dépasser ${MAX_PASSWORD_LENGTH} caractères.`;
  }

  // A password of nothing but spaces satisfies no length rule in spirit: it is not a secret, and it is
  // what a stray paste from a spreadsheet produces.
  if (password.trim().length === 0) {
    return 'Le mot de passe ne peut pas être composé uniquement d’espaces.';
  }

  const lowered = password.toLowerCase();

  for (const term of personalTerms(context)) {
    if (lowered.includes(term)) {
      return 'Le mot de passe ne doit pas contenir votre nom ni votre adresse e-mail.';
    }
  }

  return null;
}

/**
 * The parts of a user's identity that must not appear in their password.
 *
 * The local part of the address rather than the whole address: people type `resto` far more often than
 * `resto@email.com`, and `@` is not what makes it guessable.
 */
export function personalTerms(context: PasswordContext): string[] {
  const localPart = context.email?.split('@')[0];

  return [localPart, context.firstName, context.lastName]
    .map((term) => term?.trim().toLowerCase())
    .filter((term): term is string => term !== undefined && term.length >= MIN_PERSONAL_TERM_LENGTH);
}
