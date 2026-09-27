import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { Logger as PinoLogger } from 'nestjs-pino';

import { SERVICE_NAME } from './app.constants.js';
import { withTimeout } from './common/async/with-timeout.js';
import { loadEnv } from './config/env.js';
import { QueueService } from './infra/queue/queue.service.js';
import { WorkerModule } from './worker.module.js';

/** How long to wait for the broker before declaring the worker unusable. */
const REDIS_CONNECT_TIMEOUT_MS = 5_000;

/**
 * Worker entrypoint.
 *
 * `createApplicationContext` builds the same module graph without an HTTP server:
 * no port is bound, no routes exist. Consumers are registered through
 * `QueueModule.forRoot(env, { withProcessors: true })`.
 *
 * Deployed as its own process (Fly/Render) so that job throughput is independent
 * of web traffic, and so a job's failure can never take down request handling.
 *
 * Unlike the API, this process **requires** Redis and refuses to pretend otherwise:
 *   - without REDIS_URL there is nothing to consume, and starting only to exit
 *     immediately would read to an orchestrator as a crash loop with exit code 0;
 *   - with an unreachable broker it must fail fast. ioredis retries indefinitely, so
 *     an unbounded connectivity check would hang the process and report nothing —
 *     hence the explicit deadline, and a hard `process.exit(1)` afterwards, since
 *     the retrying client would otherwise keep the event loop alive forever.
 */
async function bootstrap(): Promise<void> {
  const env = loadEnv();

  if (env.redisUrl === undefined) {
    throw new Error(
      `The ${SERVICE_NAME} worker requires REDIS_URL. Set it (see apps/api/.env.example) or do not run this entrypoint.`,
    );
  }

  const app = await NestFactory.createApplicationContext(WorkerModule, { bufferLogs: true });

  app.useLogger(app.get(PinoLogger));
  // Without this, SIGTERM kills the process mid-job instead of finishing it.
  app.enableShutdownHooks();

  const logger = app.get(PinoLogger);

  try {
    // Prove the broker is reachable before declaring the worker healthy: a worker
    // that cannot consume is not "up", it is broken.
    const latencyMs = await withTimeout(
      app.get(QueueService).ping(),
      REDIS_CONNECT_TIMEOUT_MS,
      `Redis did not answer within ${REDIS_CONNECT_TIMEOUT_MS} ms`,
    );

    logger.log(
      `${SERVICE_NAME} worker started — connected to Redis (${latencyMs} ms), consuming queues.`,
    );
  } catch (error) {
    logger.error(`Cannot consume jobs: ${String(error)}`);
    await app.close().catch(() => undefined);

    // Hard exit on purpose: a graceful return would leave the retrying Redis client
    // holding the event loop open, and a supervisor must see a non-zero exit so it
    // can restart with backoff.
    process.exit(1);
  }
}

bootstrap().catch((error: unknown) => {
  process.stderr.write(`Failed to start ${SERVICE_NAME} worker: ${String(error)}\n`);
  process.exitCode = 1;
});
