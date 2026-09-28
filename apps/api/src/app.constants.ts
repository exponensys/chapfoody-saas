/**
 * Process-wide constants shared by bootstrap, logging and the health probes.
 */

export const SERVICE_NAME = 'chapfoody-api';

/**
 * Milestone currently implemented, surfaced by `/health` and `/v1/meta` so that a
 * deployed instance states what it is running (bumped as the plan progresses).
 *
 * M2 was complete at 134 models and 33 migrations; M3 — authentication, MFA and the
 * tenant and entitlement guards — is in progress. Bumped from `M1`, which had
 * become stale the moment M2 landed.
 */
export const CURRENT_MILESTONE = 'M3';

/** Global route prefix for the versioned API. Health probes are excluded. */
export const API_PREFIX = 'v1';
