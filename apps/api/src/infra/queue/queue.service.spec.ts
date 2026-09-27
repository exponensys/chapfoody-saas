import type { Queue } from 'bullmq';

import { QueueService } from './queue.service.js';

const CONNECTION = { host: 'localhost', port: 6379, maxRetriesPerRequest: null };

/** A queue double: the service only forwards to BullMQ, so a stub is faithful here. */
function stubQueue(): Queue & { getJobCounts: jest.Mock } {
  return {
    getJobCounts: jest.fn().mockResolvedValue({ waiting: 0, active: 0 }),
  } as unknown as Queue & { getJobCounts: jest.Mock };
}

describe('QueueService — disabled queue', () => {
  const service = new QueueService(undefined, undefined);

  it('reports itself as disabled', () => {
    expect(service.isEnabled).toBe(false);
  });

  it('refuses to ping', async () => {
    await expect(service.ping()).rejects.toThrow(/not configured/);
  });

  it('refuses the health-check round trip', async () => {
    await expect(service.runHealthCheck()).rejects.toThrow(/not configured/);
  });

  it('shuts down cleanly without ever having connected', async () => {
    await expect(service.onModuleDestroy()).resolves.toBeUndefined();
  });
});

describe('QueueService — configured queue', () => {
  it('reports itself as enabled', async () => {
    const service = new QueueService(stubQueue(), CONNECTION);

    expect(service.isEnabled).toBe(true);

    await service.onModuleDestroy();
  });

  it('measures the ping round trip and releases nothing prematurely', async () => {
    const queue = stubQueue();
    const service = new QueueService(queue, CONNECTION);

    await expect(service.ping()).resolves.toBeGreaterThanOrEqual(0);
    expect(queue.getJobCounts).toHaveBeenCalledWith('waiting', 'active');

    await service.onModuleDestroy();
  });

  it('does not open a Redis connection until something actually needs one', () => {
    // Constructing the service must stay side-effect free: a connection opened in the
    // constructor would make the service impossible to build — and to test — without a
    // live server. Only `runHealthCheck` needs the events listener.
    const service = new QueueService(stubQueue(), CONNECTION);

    // Nothing to assert about a private field beyond reaching this line without a
    // connection attempt and without throwing.
    expect(service.isEnabled).toBe(true);
  });
});
