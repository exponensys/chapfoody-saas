import { Logger } from '@nestjs/common';

import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { QueueService } from '../../infra/queue/queue.service.js';
import { HealthService } from './health.service.js';

/**
 * Probe behaviour for every combination of configured/unreachable.
 *
 * The contract that matters most: a probe **never throws**. A health endpoint that
 * can raise is useless to an orchestrator, because it cannot tell "the dependency
 * is down" from "the probe itself is broken".
 */

function prismaDouble(options: { configured: boolean; latencyMs?: number; fail?: boolean }) {
  return {
    get isConfigured() {
      return options.configured;
    },
    ping: jest.fn(async () => {
      if (options.fail === true) throw new Error('connection refused');
      return options.latencyMs ?? 7;
    }),
  } as unknown as PrismaService;
}

function queueDouble(options: { enabled: boolean; latencyMs?: number; fail?: boolean }) {
  return {
    get isEnabled() {
      return options.enabled;
    },
    ping: jest.fn(async () => {
      if (options.fail === true) throw new Error('redis down');
      return options.latencyMs ?? 3;
    }),
  } as unknown as QueueService;
}

beforeEach(() => {
  // The probes log a failure with its stack; that is desirable in production and
  // noise in a test run.
  jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
});

describe('HealthService.checkDatabase', () => {
  it('reports not-configured, without probing, when DATABASE_URL is absent', async () => {
    const prisma = prismaDouble({ configured: false });
    const result = await new HealthService(prisma, queueDouble({ enabled: false })).checkDatabase();

    expect(result).toMatchObject({ status: 'not-configured', dependency: 'database', latencyMs: null });
    expect(prisma.ping).not.toHaveBeenCalled();
  });

  it('reports up with the measured latency', async () => {
    const result = await new HealthService(
      prismaDouble({ configured: true, latencyMs: 42 }),
      queueDouble({ enabled: false }),
    ).checkDatabase('req-1');

    expect(result).toMatchObject({ status: 'up', latencyMs: 42, requestId: 'req-1' });
  });

  it('reports down instead of throwing when the probe fails', async () => {
    const result = await new HealthService(
      prismaDouble({ configured: true, fail: true }),
      queueDouble({ enabled: false }),
    ).checkDatabase();

    expect(result.status).toBe('down');
    expect(result.message).toContain('injoignable');
    // The internal cause must not be part of the payload.
    expect(result.message).not.toContain('connection refused');
  });
});

describe('HealthService.checkQueue', () => {
  it('reports disabled when the queue was never configured', async () => {
    const result = await new HealthService(
      prismaDouble({ configured: false }),
      queueDouble({ enabled: false }),
    ).checkQueue();

    expect(result).toMatchObject({ status: 'disabled', dependency: 'queue' });
  });

  it('reports up with the measured latency', async () => {
    const result = await new HealthService(
      prismaDouble({ configured: false }),
      queueDouble({ enabled: true, latencyMs: 4 }),
    ).checkQueue('req-2');

    expect(result).toMatchObject({ status: 'up', latencyMs: 4, requestId: 'req-2' });
  });

  it('reports down instead of throwing when the probe fails', async () => {
    const result = await new HealthService(
      prismaDouble({ configured: false }),
      queueDouble({ enabled: true, fail: true }),
    ).checkQueue();

    expect(result.status).toBe('down');
    expect(result.message).not.toContain('redis down');
  });
});
