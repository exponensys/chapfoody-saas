import { Injectable, Logger } from '@nestjs/common';

import type { DependencyHealthResponseBody } from '../../common/errors/error-response.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { QueueService } from '../../infra/queue/queue.service.js';
import { buildDependencyPayload } from './health.payloads.js';

/**
 * Dependency probes.
 *
 * The contract is that a probe **never throws**: a health endpoint that can raise
 * is useless to a probe, because it cannot distinguish "the dependency is down"
 * from "the probe is broken". Failures are caught, logged once and reported as
 * data — the controller then chooses the HTTP status.
 *
 * `not-configured` and `disabled` are distinct from `down` on purpose:
 *   - `not-configured` — DATABASE_URL is absent (development, tests)
 *   - `disabled`       — REDIS_URL is absent, so the queue was never started
 *   - `down`           — configured, but unreachable
 */
@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly queue: QueueService,
  ) {}

  async checkDatabase(requestId?: string): Promise<DependencyHealthResponseBody> {
    if (!this.prisma.isConfigured) {
      return buildDependencyPayload({
        dependency: 'database',
        status: 'not-configured',
        message: 'DATABASE_URL n’est pas défini.',
        requestId,
      });
    }

    try {
      const latencyMs = await this.prisma.ping();
      return buildDependencyPayload({ dependency: 'database', status: 'up', latencyMs, requestId });
    } catch (error) {
      this.logger.error('Database health probe failed', error as Error);

      return buildDependencyPayload({
        dependency: 'database',
        status: 'down',
        message: 'La base de données est injoignable.',
        requestId,
      });
    }
  }

  async checkQueue(requestId?: string): Promise<DependencyHealthResponseBody> {
    if (!this.queue.isEnabled) {
      return buildDependencyPayload({
        dependency: 'queue',
        status: 'disabled',
        message: 'REDIS_URL n’est pas défini : les files de traitement sont désactivées.',
        requestId,
      });
    }

    try {
      const latencyMs = await this.queue.ping();
      return buildDependencyPayload({ dependency: 'queue', status: 'up', latencyMs, requestId });
    } catch (error) {
      this.logger.error('Queue health probe failed', error as Error);

      return buildDependencyPayload({
        dependency: 'queue',
        status: 'down',
        message: 'La file de traitement est injoignable.',
        requestId,
      });
    }
  }
}
