/**
 * Races a promise against a deadline.
 *
 * Used at start-up to bound a connectivity check. Without it, a client library that
 * retries forever (ioredis, typically) turns "the broker is unreachable" into "the
 * process hangs and never reports anything", which is the worst possible failure
 * mode for an orchestrator.
 *
 * The underlying promise is not cancelled — JavaScript cannot do that — so the
 * caller must still drop whatever it started. This function only guarantees that
 * *this* await resolves.
 */
export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message?: string,
): Promise<T> {
  let timer: NodeJS.Timeout | undefined;

  const deadline = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new TimeoutError(message ?? `Operation did not complete within ${timeoutMs} ms`));
    }, timeoutMs);
    // Do not hold the event loop open just for the timer.
    timer.unref?.();
  });

  try {
    return await Promise.race([promise, deadline]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}
