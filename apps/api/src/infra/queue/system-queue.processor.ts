import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';

import { QUEUE_NAMES, SYSTEM_JOBS, type SystemJobName } from './queue.constants.js';

/**
 * The consumer side of the queue — registered in the worker entrypoint only.
 *
 * Today it answers the health-check job, which is what proves in CI that
 * producer, Redis and consumer are actually connected end to end. Real consumers
 * arrive with the domain modules (M12: report generation, campaign sending,
 * integration syncs).
 *
 * Unknown job names throw on purpose: a producer/consumer mismatch is a
 * deployment bug, and swallowing it would hide the failure behind a silent no-op.
 */
@Processor(QUEUE_NAMES.system)
export class SystemQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(SystemQueueProcessor.name);

  async process(job: Job<Record<string, unknown>, unknown, SystemJobName>): Promise<unknown> {
    if (job.name === SYSTEM_JOBS.healthCheck) {
      this.logger.debug(`Handled ${job.name} job ${String(job.id)}`);

      return {
        ok: true,
        jobId: job.id ?? null,
        receivedAt: new Date().toISOString(),
        payload: job.data,
      };
    }

    throw new Error(`Unknown job "${job.name}" on queue "${QUEUE_NAMES.system}".`);
  }
}
