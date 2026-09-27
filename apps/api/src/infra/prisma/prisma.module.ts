import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service.js';

/**
 * Database access. No models yet: milestone M2 owns `prisma/schema.prisma`, its
 * migrations and the seed. This module exists from M1 so that the health probe,
 * the connection strategy (pooled URL at runtime) and the test harness are in
 * place before the first query is written.
 *
 * `@Global()` on purpose: this is a platform capability that nearly every feature
 * module needs, exactly like the configuration module. The boundary rule in the
 * implementation plan is about *domain* modules not reaching into each other's
 * repositories — infrastructure being globally injectable does not weaken it, and
 * it avoids every consumer having to import this module.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
