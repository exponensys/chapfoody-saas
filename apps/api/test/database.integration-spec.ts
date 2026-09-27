import type { ApiEnv } from '../src/config/env.js';
import { PrismaService } from '../src/infra/prisma/prisma.service.js';

/**
 * Real PostgreSQL round trip.
 *
 * OPT-IN. Set `INTEGRATION_DATABASE_URL` to a database you are happy to query —
 * Docker locally (`pnpm db:up`) or a Neon branch:
 *
 *   INTEGRATION_DATABASE_URL="postgresql://chapfoody:chapfoody@localhost:5432/chapfoody" \
 *     pnpm --filter @chapfoody/api test:integration
 *
 * It is skipped rather than failed when the variable is absent, so a developer
 * without a database — and the machine this milestone was built on, which has no
 * Docker — still gets a green unit/e2e run. The skip is announced, never silent.
 */
const databaseUrl = process.env.INTEGRATION_DATABASE_URL;
const describeWhenConfigured = databaseUrl === undefined ? describe.skip : describe;

if (databaseUrl === undefined) {
  process.stdout.write(
    '\n⏭  Skipping the database integration suite: INTEGRATION_DATABASE_URL is not set.\n' +
      '   Start one with `pnpm db:up`, then re-run with the variable exported.\n\n',
  );
}

function makeEnv(url: string): ApiEnv {
  return {
    nodeEnv: 'test',
    port: 4000,
    databaseUrl: url,
    redisUrl: undefined,
    corsOrigins: [],
    logLevel: 'silent',
    swaggerEnabled: false,
  };
}

describeWhenConfigured('PrismaService against a real PostgreSQL (integration)', () => {
  let service: PrismaService;

  beforeAll(() => {
    service = new PrismaService(makeEnv(databaseUrl as string));
  });

  afterAll(async () => {
    await service.onModuleDestroy();
  });

  it('reports itself as configured and measures a real round trip', async () => {
    expect(service.isConfigured).toBe(true);
    await expect(service.ping()).resolves.toBeGreaterThanOrEqual(0);
  });

  it('executes a real query through the generated Prisma client', async () => {
    const rows = await service.getClient().$queryRaw<{ one: number }[]>`SELECT 1::int AS one`;

    expect(rows[0]?.one).toBe(1);
  });

  it('connects through the driver adapter with the URL it was given', async () => {
    // Mutating this connection string to an unroutable port must break it: proof
    // that the URL handed to PrismaService is the one actually used, rather than
    // something Prisma picked up from the environment on its own.
    const misdirected = new PrismaService(
      makeEnv('postgresql://nobody:nobody@127.0.0.1:1/chapfoody?connect_timeout=2'),
    );

    await expect(misdirected.ping()).rejects.toThrow();
    await misdirected.onModuleDestroy();
  });
});
