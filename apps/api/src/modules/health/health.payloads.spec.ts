import { CURRENT_MILESTONE, SERVICE_NAME } from '../../app.constants.js';
import { buildDependencyPayload, buildLivenessPayload } from './health.payloads.js';

describe('buildLivenessPayload', () => {
  it('is deterministic when the clock and uptime are injected', () => {
    expect(
      buildLivenessPayload({ now: new Date('2026-09-27T10:00:00.000Z'), uptimeSeconds: 1234.87 }),
    ).toEqual({
      status: 'ok',
      service: SERVICE_NAME,
      milestone: CURRENT_MILESTONE,
      uptimeSeconds: 1234,
      timestamp: '2026-09-27T10:00:00.000Z',
    });
  });

  it('never reports a negative uptime, in case the process clock jumps backwards', () => {
    expect(buildLivenessPayload({ uptimeSeconds: -12 }).uptimeSeconds).toBe(0);
  });

  it('uses the real clock and uptime when nothing is injected', () => {
    const before = Date.now();
    const payload = buildLivenessPayload();

    expect(payload.status).toBe('ok');
    expect(Date.parse(payload.timestamp)).toBeGreaterThanOrEqual(before);
    expect(payload.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });

  it('reports the running milestone, so a deployment can be identified from a probe', () => {
    // Asserted against the constant rather than a literal: the test's intent is that the payload
    // REPORTS the running milestone, and hardcoding the value meant every milestone bump broke a probe
    // test that had nothing to do with the change.
    expect(buildLivenessPayload().milestone).toBe(CURRENT_MILESTONE);
  });
});

describe('buildDependencyPayload', () => {
  it('reports an up dependency with its latency', () => {
    expect(
      buildDependencyPayload({
        dependency: 'database',
        status: 'up',
        latencyMs: 12,
        now: new Date('2026-09-27T10:00:00.000Z'),
      }),
    ).toEqual({
      status: 'up',
      dependency: 'database',
      latencyMs: 12,
      timestamp: '2026-09-27T10:00:00.000Z',
    });
  });

  it('defaults the latency to null when the dependency was not measured', () => {
    const payload = buildDependencyPayload({ dependency: 'queue', status: 'disabled' });

    expect(payload.latencyMs).toBeNull();
    expect(payload).not.toHaveProperty('message');
    expect(payload).not.toHaveProperty('requestId');
  });

  it('includes the correlation id when one is available', () => {
    expect(
      buildDependencyPayload({
        dependency: 'queue',
        status: 'down',
        message: 'La file de traitement est injoignable.',
        requestId: 'req-1',
      }),
    ).toMatchObject({
      status: 'down',
      requestId: 'req-1',
      message: 'La file de traitement est injoignable.',
    });
  });
});
