import { Inject, Injectable, type OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { AppException } from '../../common/errors/app.exception.js';
import type { ApiEnv } from '../../config/env.js';
import { API_ENV } from '../../config/env.token.js';
import { PrismaClient } from '../../generated/prisma/client.js';

/**
 * Prisma access.
 *
 * ── Prisma 7 shape ───────────────────────────────────────────────────────────
 * Prisma 7 no longer reads a connection URL from `schema.prisma`; the runtime
 * client connects through a **driver adapter**, which is why a `PrismaPg` is built
 * here. The CLI (migrations) keeps using the direct URL from `prisma.config.ts`,
 * so the pooled/direct split still holds — it just lives in two places now:
 *
 *   this file            → POOLED url (runtime; PgBouncer, transaction mode)
 *   prisma.config.ts     → DIRECT url (migrations; needs session-level locks)
 *
 * ── Why the client is created lazily ────────────────────────────────────────
 * A fresh clone has no DATABASE_URL (M1 has no models to migrate yet), and the API
 * must still boot. A missing database is a *degraded* state that `/health/db`
 * reports, not a reason for the process to die — so the client is only built when
 * a URL actually exists.
 */
@Injectable()
export class PrismaService implements OnModuleDestroy {
  private client: PrismaClient | undefined;

  constructor(@Inject(API_ENV) private readonly env: ApiEnv) {}

  /** True when DATABASE_URL is present, i.e. a connection can be attempted. */
  get isConfigured(): boolean {
    return this.env.databaseUrl !== undefined;
  }

  /**
   * The connected client.
   *
   * Throws a 503 rather than returning undefined: a caller that reaches this point
   * genuinely needs the database, and a typed failure beats an `undefined` that
   * explodes three frames later.
   */
  getClient(): PrismaClient {
    if (this.env.databaseUrl === undefined) {
      throw AppException.serviceUnavailable(
        'La base de données n’est pas configurée (DATABASE_URL manquant).',
        { dependency: 'database' },
      );
    }

    if (this.client === undefined) {
      // The pooled connection string is passed to the adapter explicitly, so there
      // is exactly one place that decides which URL the runtime uses.
      this.client = new PrismaClient({ adapter: new PrismaPg(this.env.databaseUrl) });
    }

    return this.client;
  }

  /** Round-trip check used by `/health/db`. Returns the measured latency in ms. */
  async ping(): Promise<number> {
    const startedAt = Date.now();
    await this.getClient().$queryRaw`SELECT 1`;
    return Date.now() - startedAt;
  }

  async onModuleDestroy(): Promise<void> {
    await this.client?.$disconnect();
    this.client = undefined;
  }
}
