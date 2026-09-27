import { Queue, Worker } from 'bullmq';

import { QUEUE_NAMES } from '../src/infra/queue/queue.constants.js';
import { QueueService } from '../src/infra/queue/queue.service.js';
import { buildRedisConnection } from '../src/infra/queue/redis-connection.js';
import { SystemQueueProcessor } from '../src/infra/queue/system-queue.processor.js';

/**
 * Full queue round trip: producer → Redis → worker → result.
 *
 * OPT-IN. Set `INTEGRATION_REDIS_URL` (Docker locally via `pnpm db:up`, or any Redis):
 *
 *   INTEGRATION_REDIS_URL="redis://localhost:6379" \
 *     pnpm --filter @chapfoody/api test:integration
 *
 * This is the test that proves the worker entrypoint is genuinely connected — the
 * Definition of Done for M1 says “the worker starts and consumes a no-op job”, and
 * nothing short of a real broker demonstrates it.
 */
const redisUrl = process.env.INTEGRATION_REDIS_URL;
const describeWhenConfigured = redisUrl === undefined ? describe.skip : describe;

if (redisUrl === undefined) {
  process.stdout.write(
    '\n⏭  Skipping the queue integration suite: INTEGRATION_REDIS_URL is not set.\n' +
      '   Start one with `pnpm db:up`, then re-run with the variable exported.\n\n',
  );
}

describeWhenConfigured('queue round trip against a real Redis (integration)', () => {
  let queue: Queue;
  let worker: Worker;
  let service: QueueService;

  beforeAll(() => {
    // The real connection builder and the real processor: only the wiring around
    // them is test-specific.
    const connection = buildRedisConnection(redisUrl as string);
    const processor = new SystemQueueProcessor();

    queue = new Queue(QUEUE_NAMES.system, { connection });
    worker = new Worker(QUEUE_NAMES.system, (job) => processor.process(job as never), { connection });
    service = new QueueService(queue, connection);
  });

  afterAll(async () => {
    await service.onModuleDestroy();
    await worker.close();
    await queue.close();
  });

  it('reports the queue as enabled', () => {
    expect(service.isEnabled).toBe(true);
  });

  it('answers a health ping through Redis', async () => {
    await expect(service.ping()).resolves.toBeGreaterThanOrEqual(0);
  });

  it('produces a job, consumes it in a worker and resolves its result', async () => {
    const result = await service.runHealthCheck({ probe: 'integration' });

    expect(result).toMatchObject({ ok: true, payload: { probe: 'integration' } });
  });
});
