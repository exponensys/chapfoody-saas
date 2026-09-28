import { Module } from '@nestjs/common';

import { createLoggerModule } from './common/logging/logger.module.js';
import { ConfigModule } from './config/config.module.js';
import { loadEnv } from './config/env.js';
import { PrismaModule } from './infra/prisma/prisma.module.js';
import { QueueModule } from './infra/queue/queue.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { MetaModule } from './modules/meta/meta.module.js';
import { ThrottlingModule } from './modules/throttling/throttling.module.js';

/**
 * The environment is read once here because the logger and the queue need their
 * options while the module graph is being *defined*, not when it is instantiated.
 * `loadEnv` is pure and cheap, so calling it at module scope is safe — and an
 * invalid environment throws immediately, which is the intended behaviour.
 */
const env = loadEnv();

/**
 * HTTP application module.
 *
 * Scope of M1: configuration, logging, validation, error envelope, health probes,
 * metadata and the queue/Prisma infrastructure. Domain modules (auth, catalog,
 * orders, …) are attached here as their milestones land.
 */
@Module({
  imports: [
    ConfigModule,
    createLoggerModule(env),
    PrismaModule,
    // `withProcessors: false` — the API never consumes jobs. Processing belongs to
    // the worker entrypoint so that traffic and job throughput scale separately.
    QueueModule.forRoot(env, { withProcessors: false }),
    // Registered BEFORE AuthModule, and that order is load-bearing: global guards run in registration
    // order, so the rate limiter sees a request before the authentication guards do any work on it. The
    // point of a limiter is to reject a flood BEFORE the expensive part — an Argon2 verify, a database
    // round trip — not after it.
    ThrottlingModule,
    // Registers the global `JwtAuthGuard`, so every controller added from here on is protected by
    // default and has to opt out with `@Public()`.
    AuthModule,
    HealthModule,
    MetaModule,
  ],
})
export class AppModule {}
