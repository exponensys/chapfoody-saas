import type { Job } from 'bullmq';

import { SYSTEM_JOBS, type SystemJobName } from './queue.constants.js';
import { SystemQueueProcessor } from './system-queue.processor.js';

/**
 * A job double: the processor only reads `name`, `id` and `data`. Typed with the
 * processor's own generics so the test cannot drift from the real signature.
 */
function job(
  name: string,
  data: Record<string, unknown> = {},
  id = 'job-1',
): Job<Record<string, unknown>, unknown, SystemJobName> {
  return { id, name, data } as unknown as Job<Record<string, unknown>, unknown, SystemJobName>;
}

describe('SystemQueueProcessor', () => {
  const processor = new SystemQueueProcessor();

  it('answers the health-check job, echoing its payload back', async () => {
    await expect(processor.process(job(SYSTEM_JOBS.healthCheck, { probe: 'a' }))).resolves.toMatchObject(
      {
        ok: true,
        jobId: 'job-1',
        payload: { probe: 'a' },
      },
    );
  });

  it('timestamps its answer, so a stalled consumer is detectable', async () => {
    const result = (await processor.process(job(SYSTEM_JOBS.healthCheck))) as { receivedAt: string };

    expect(Number.isNaN(Date.parse(result.receivedAt))).toBe(false);
  });

  it('fails loudly on an unknown job name, rather than silently doing nothing', async () => {
    // A producer/consumer mismatch is a deployment bug; swallowing it would hide the
    // failure behind a successful-looking no-op.
    await expect(processor.process(job('something-else'))).rejects.toThrow(
      /Unknown job "something-else" on queue "system"/,
    );
  });
});
