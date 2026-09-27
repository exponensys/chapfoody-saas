import { AppException } from '../../common/errors/app.exception.js';
import type { ApiEnv } from '../../config/env.js';
import { PrismaService } from './prisma.service.js';

/** A complete environment, so each test only states what it is actually varying. */
function makeEnv(overrides: Partial<ApiEnv> = {}): ApiEnv {
  return {
    nodeEnv: 'test',
    port: 4000,
    databaseUrl: undefined,
    redisUrl: undefined,
    corsOrigins: [],
    logLevel: 'silent',
    swaggerEnabled: false,
    ...overrides,
  };
}

describe('PrismaService', () => {
  it('reports not configured when DATABASE_URL is absent', () => {
    expect(new PrismaService(makeEnv()).isConfigured).toBe(false);
  });

  it('reports configured once DATABASE_URL is present', () => {
    const service = new PrismaService(makeEnv({ databaseUrl: 'postgresql://localhost:5432/x' }));

    expect(service.isConfigured).toBe(true);
  });

  it('refuses to hand out a client, with a 503, when unconfigured', () => {
    const service = new PrismaService(makeEnv());

    expect(() => service.getClient()).toThrow(AppException);
    expect(() => service.getClient()).toThrow(/DATABASE_URL/);
  });

  it('creates the client once and reuses it, so connections are not leaked', async () => {
    const service = new PrismaService(makeEnv({ databaseUrl: 'postgresql://localhost:5432/x' }));

    const first = service.getClient();

    expect(service.getClient()).toBe(first);

    await service.onModuleDestroy();
  });

  it('forgets the client after shutdown, so a later call builds a fresh one', async () => {
    const service = new PrismaService(makeEnv({ databaseUrl: 'postgresql://localhost:5432/x' }));

    const first = service.getClient();
    await service.onModuleDestroy();
    const second = service.getClient();

    expect(second).not.toBe(first);

    await service.onModuleDestroy();
  });

  it('is safe to shut down twice, and when no client was ever created', async () => {
    const neverUsed = new PrismaService(makeEnv());
    await expect(neverUsed.onModuleDestroy()).resolves.toBeUndefined();

    const service = new PrismaService(makeEnv({ databaseUrl: 'postgresql://localhost:5432/x' }));
    service.getClient();
    await service.onModuleDestroy();
    await expect(service.onModuleDestroy()).resolves.toBeUndefined();
  });

  it('fails the ping when the database is unreachable', async () => {
    // Port 1 is unroutable, so this proves the failure path — and therefore that
    // /health/db can report "down" — without needing a database to exist.
    const service = new PrismaService(makeEnv({ databaseUrl: 'postgresql://127.0.0.1:1/chapfoody' }));

    await expect(service.ping()).rejects.toThrow();

    await service.onModuleDestroy();
  });
});
