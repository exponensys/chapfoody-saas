import { TimeoutError, withTimeout } from './with-timeout.js';

describe('withTimeout', () => {
  it('resolves with the value when the promise wins the race', async () => {
    await expect(withTimeout(Promise.resolve('done'), 1_000)).resolves.toBe('done');
  });

  it('rejects with TimeoutError when the deadline is reached first', async () => {
    const never = new Promise<never>(() => undefined);

    await expect(withTimeout(never, 10, 'Redis did not answer')).rejects.toThrow(TimeoutError);
    await expect(withTimeout(never, 10, 'Redis did not answer')).rejects.toThrow(
      'Redis did not answer',
    );
  });

  it('uses a readable default message when none is given', async () => {
    const never = new Promise<never>(() => undefined);

    await expect(withTimeout(never, 10)).rejects.toThrow(/did not complete within 10 ms/);
  });

  it('propagates the original rejection, so a real error is not masked as a timeout', async () => {
    const failing = Promise.reject(new Error('connection refused'));

    await expect(withTimeout(failing, 1_000)).rejects.toThrow('connection refused');
  });

  it('does not leave a timer behind that could keep the process alive', async () => {
    // The timer is unref'd, so it cannot hold the event loop open; this test mainly
    // proves the happy path leaves no pending handle that Jest would warn about.
    const handlesBefore = process.getActiveResourcesInfo().length;

    await withTimeout(Promise.resolve(1), 60_000);
    await new Promise((resolve) => setImmediate(resolve));

    expect(process.getActiveResourcesInfo().length).toBeLessThanOrEqual(handlesBefore);
  });
});
