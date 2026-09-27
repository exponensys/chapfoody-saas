import { CURRENT_MILESTONE, SERVICE_NAME } from '../../app.constants.js';
import type {
  DependencyHealthResponseBody,
  HealthResponseBody,
} from '../../common/errors/error-response.js';

/**
 * Health payload builders.
 *
 * Pure functions with injectable time and uptime, so tests assert exact values
 * instead of racing the clock. Kept apart from the service that performs the
 * probes, because "what we report" and "how we probe" change for different
 * reasons.
 */

export function buildLivenessPayload(
  options: { now?: Date; uptimeSeconds?: number } = {},
): HealthResponseBody {
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

export interface DependencyHealthInput {
  dependency: 'database' | 'queue';
  status: DependencyHealthResponseBody['status'];
  latencyMs?: number | null;
  message?: string;
  requestId?: string;
  now?: Date;
}

export function buildDependencyPayload(input: DependencyHealthInput): DependencyHealthResponseBody {
  const { dependency, status, latencyMs = null, message, requestId, now = new Date() } = input;

  return {
    status,
    dependency,
    latencyMs,
    ...(message === undefined ? {} : { message }),
    ...(requestId === undefined ? {} : { requestId }),
    timestamp: now.toISOString(),
  };
}
