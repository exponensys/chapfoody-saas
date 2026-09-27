import { BUSINESS_CATEGORIES, type BusinessCategory } from '@chapfoody/types';

/**
 * Response payloads of the two M0 endpoints.
 *
 * Kept as pure builders — `now` and `uptimeSeconds` are injectable — so the tests
 * assert exact values instead of racing the clock.
 */

export const SERVICE_NAME = 'chapfoody-api';

/** Milestone currently deployed. Bumped as the plan progresses. */
export const CURRENT_MILESTONE = 'M0';

export interface HealthPayload {
  status: 'ok';
  service: typeof SERVICE_NAME;
  milestone: string;
  uptimeSeconds: number;
  timestamp: string;
}

export interface MetaPayload {
  service: typeof SERVICE_NAME;
  milestone: string;
  /**
   * Authoritative list of the dashboards the platform supports, published so the
   * frontends never redefine it (see @chapfoody/types and requirement A.VI).
   */
  supportedCategories: readonly BusinessCategory[];
}

export function buildHealthPayload(
  options: { now?: Date; uptimeSeconds?: number } = {},
): HealthPayload {
  const now = options.now ?? new Date();
  const uptimeSeconds = options.uptimeSeconds ?? process.uptime();

  return {
    status: 'ok',
    service: SERVICE_NAME,
    milestone: CURRENT_MILESTONE,
    // Negative values can occur if the process clock jumps backwards.
    uptimeSeconds: Math.max(0, Math.floor(uptimeSeconds)),
    timestamp: now.toISOString(),
  };
}

export function buildMetaPayload(): MetaPayload {
  return {
    service: SERVICE_NAME,
    milestone: CURRENT_MILESTONE,
    supportedCategories: BUSINESS_CATEGORIES,
  };
}
