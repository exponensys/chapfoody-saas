import { BullModule } from '@nestjs/bullmq';
import { type DynamicModule, Global, Logger, Module } from '@nestjs/common';

import type { ApiEnv } from '../../config/env.js';
import { QUEUE_CONNECTION, QUEUE_NAMES } from './queue.constants.js';
import { QueueService } from './queue.service.js';
import { buildRedisConnection } from './redis-connection.js';
import { SystemQueueProcessor } from './system-queue.processor.js';

export interface QueueModuleOptions {
  /**
   * Whether to register the consumer.
   *
   * `true` in the worker entrypoint only. The API must never compete for jobs:
   * otherwise a traffic spike or a rolling deploy would silently change job
   * throughput, and a job's side effects could run inside a web request.
   */
  withProcessors?: boolean;
}

/**
 * Queue wiring, registered per entrypoint.
 *
 * Two behaviours worth stating explicitly:
 *   - Without REDIS_URL the module still provides `QueueService`, so
 *     `/health/queue` can report `disabled` and no ioredis client is ever created
 *     (no connection-error noise on a Redis-less machine).
 *   - With REDIS_URL the connection is parsed and shared, so the queue, the
 *     events listener and the workers all use identical options.
 *
 * `@Global()` because the module is registered dynamically exactly once (by
 * AppModule or WorkerModule) and its `QueueService` is needed by feature modules
 * such as HealthModule. A module that imported the class directly would get the
 * *static* module — no providers — and, worse, re-registering
 * `QueueModule.forRoot()` elsewhere would open a second Redis connection.
 */
@Global()
@Module({})
export class QueueModule {
  private static readonly logger = new Logger(QueueModule.name);

  static forRoot(env: ApiEnv, options: QueueModuleOptions = {}): DynamicModule {
    const withProcessors = options.withProcessors ?? false;

    if (env.redisUrl === undefined) {
      QueueModule.logger.warn(
        'REDIS_URL is not set — background queues are disabled and /health/queue will report "disabled".',
      );

      return {
        module: QueueModule,
        providers: [QueueService],
        exports: [QueueService],
      };
    }

    const connection = buildRedisConnection(env.redisUrl);

    return {
      module: QueueModule,
      imports: [
        BullModule.forRoot({ connection }),
        BullModule.registerQueue({ name: QUEUE_NAMES.system }),
      ],
      providers: [
        { provide: QUEUE_CONNECTION, useValue: connection },
        QueueService,
        ...(withProcessors ? [SystemQueueProcessor] : []),
      ],
      exports: [QueueService],
    };
  }
}
