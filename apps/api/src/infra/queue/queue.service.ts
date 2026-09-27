import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Logger, Optional, type OnModuleDestroy } from '@nestjs/common';
import { Queue, QueueEvents, type ConnectionOptions } from 'bullmq';

import { QUEUE_CONNECTION, QUEUE_NAMES, SYSTEM_JOBS } from './queue.constants.js';

/**
 * Queue health and the round-trip used to prove the worker is alive.
 *
 * The queue is **optional by design**: without REDIS_URL the API still boots and
 * serves every endpoint, and `/health/queue` reports `disabled` instead of
 * failing. That keeps a fresh clone and a Redis-less environment usable, while an
 * environment that *has* configured Redis gets a real verdict.
 *
 * `@InjectQueue` is optional, so this service works whether or not
 * `QueueModule.forRoot` registered the BullMQ connection.
 */
@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private readonly connection: ConnectionOptions | undefined;
  private events: QueueEvents | undefined;

  constructor(
    @Optional() @InjectQueue(QUEUE_NAMES.system) private readonly systemQueue: Queue | undefined,
    @Optional() @Inject(QUEUE_CONNECTION) connection: ConnectionOptions | undefined,
  ) {
    this.connection = connection;
  }

  get isEnabled(): boolean {
    return this.systemQueue !== undefined;
  }

  /**
   * The events listener that lets a producer await a job's result.
   *
   * Built on first use rather than in the constructor: opening a Redis connection for
   * a service that may never enqueue anything is wasteful, and it would make the
   * service impossible to construct — and therefore to test — without a live server.
   */
  private getQueueEvents(): QueueEvents {
    if (this.events === undefined) {
      if (this.connection === undefined) {
        throw new Error('Queue is not configured');
      }

      this.events = new QueueEvents(QUEUE_NAMES.system, { connection: this.connection });
    }

    return this.events;
  }

  /** Round-trip check used by `/health/queue`. Returns the latency in ms. */
  async ping(): Promise<number> {
    if (this.systemQueue === undefined) {
      throw new Error('Queue is not configured');
    }

    const startedAt = Date.now();
    // `getJobCounts` is a cheap Redis round trip and, unlike `client.ping()`, goes
    // through BullMQ's own connection handling.
    await this.systemQueue.getJobCounts('waiting', 'active');
    return Date.now() - startedAt;
  }

  /**
   * Enqueues the no-op job and waits for its result, proving the full chain works:
   * producer → Redis → worker → result. Used by the queue integration test and
   * available as a manual smoke check in a deployed environment.
   */
  async runHealthCheck(payload: Record<string, unknown> = {}): Promise<unknown> {
    if (this.systemQueue === undefined) {
      throw new Error('Queue is not configured');
    }

    const job = await this.systemQueue.add(SYSTEM_JOBS.healthCheck, payload);
    this.logger.debug(`Queued ${SYSTEM_JOBS.healthCheck} job ${String(job.id)}`);

    return job.waitUntilFinished(this.getQueueEvents(), 10_000);
  }

  async onModuleDestroy(): Promise<void> {
    await this.events?.close();
    this.events = undefined;
  }
}
