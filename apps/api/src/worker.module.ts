import { Module } from '@nestjs/common';

import { createLoggerModule } from './common/logging/logger.module.js';
import { ConfigModule } from './config/config.module.js';
import { loadEnv } from './config/env.js';
import { PrismaModule } from './infra/prisma/prisma.module.js';
import { QueueModule } from './infra/queue/queue.module.js';

const env = loadEnv();

/**
 * Background worker module.
 *
 * An entrypoint of the same codebase, not a separate application: it shares the
 * configuration, logging and infrastructure with the HTTP app, but registers the
 * queue **consumers** and exposes no controllers. That is the one split the
 * implementation plan calls for (ADR-0001 §D3) — integrations, report generation
 * and campaign sending can scale without touching the web tier.
 */
@Module({
  imports: [
    ConfigModule,
    createLoggerModule(env),
    PrismaModule,
    QueueModule.forRoot(env, { withProcessors: true }),
  ],
})
export class WorkerModule {}
