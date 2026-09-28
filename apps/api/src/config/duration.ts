/**
 * Duration strings → seconds.
 *
 * `ACCESS_TOKEN_TTL="15m"` is readable and easy to get wrong, which is why the conversion lives in one
 * tested place rather than in whatever the caller felt like doing. A token lifetime is a security
 * parameter: "15m" silently parsed as 15 seconds would lock everybody out, and parsed as 15 hours
 * would quietly undo the short-lived-access-token design.
 *
 * Accepted:
 *   900       plain seconds (what the JWT library itself accepts)
 *   15m       minutes
 *   30d       days
 *   2h        hours
 *   45s       seconds
 *   "15 m"    whitespace tolerated
 *
 * Anything else throws, naming the variable, because a configuration mistake must fail at boot with an
 * actionable message rather than produce a session that expires at a surprising moment.
 */

const SECONDS_PER_UNIT: Record<string, number> = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
};

const DURATION_PATTERN = /^(\d+)\s*([smhd])?$/;

/**
 * Parses a duration into whole seconds.
 *
 * @param value    the raw string, e.g. "15m"
 * @param variable the environment variable's name, used only in the error message
 */
export function parseDurationSeconds(value: string, variable: string): number {
  const match = DURATION_PATTERN.exec(value.trim().toLowerCase());

  if (match === null) {
    throw new Error(
      `${variable} must be a duration like "15m", "30d" or a number of seconds (received "${value}").`,
    );
  }

  const amount = Number(match[1]);
  const unit = match[2] ?? 's';
  const seconds = amount * (SECONDS_PER_UNIT[unit] ?? 1);

  // Zero is refused rather than allowed: a token that expires the moment it is issued is never what
  // anyone meant, and it would present as "login does not work" rather than as a configuration error.
  if (seconds <= 0) {
    throw new Error(`${variable} must be greater than zero (received "${value}").`);
  }

  if (!Number.isSafeInteger(seconds)) {
    throw new Error(`${variable} is too large to represent in seconds (received "${value}").`);
  }

  return seconds;
}
