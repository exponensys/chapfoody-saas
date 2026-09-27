import { BUSINESS_CATEGORIES } from '@chapfoody/types';
import { describe, expect, it } from 'vitest';

import { CURRENT_MILESTONE, SERVICE_NAME, buildHealthPayload, buildMetaPayload } from './health.js';

describe('buildHealthPayload', () => {
  it('reports a deterministic payload when the clock and uptime are injected', () => {
    const payload = buildHealthPayload({
      now: new Date('2026-09-27T10:00:00.000Z'),
      uptimeSeconds: 1234.87,
    });

    expect(payload).toEqual({
      status: 'ok',
      service: SERVICE_NAME,
      milestone: CURRENT_MILESTONE,
      uptimeSeconds: 1234,
      timestamp: '2026-09-27T10:00:00.000Z',
    });
  });

  it('never reports a negative uptime, in case the process clock jumps backwards', () => {
    expect(buildHealthPayload({ uptimeSeconds: -12 }).uptimeSeconds).toBe(0);
  });

  it('uses the real clock and uptime when nothing is injected', () => {
    const before = Date.now();
    const payload = buildHealthPayload();

    expect(payload.status).toBe('ok');
    expect(Date.parse(payload.timestamp)).toBeGreaterThanOrEqual(before);
    expect(payload.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });
});

describe('buildMetaPayload', () => {
  it('publishes the ten dashboards straight from @chapfoody/types', () => {
    const payload = buildMetaPayload();

    expect(payload.service).toBe(SERVICE_NAME);
    expect(payload.supportedCategories).toEqual(BUSINESS_CATEGORIES);
    expect(payload.supportedCategories).toHaveLength(10);
  });

  it('exposes the merged grocery/fruit dashboard and the new shop dashboard', () => {
    const { supportedCategories } = buildMetaPayload();

    expect(supportedCategories).toContain('epiceries-fruiteries');
    expect(supportedCategories).toContain('boutiques-supermarche');
  });
});
