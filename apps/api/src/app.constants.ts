/**
 * Process-wide constants shared by bootstrap, logging and the health probes.
 */

export const SERVICE_NAME = 'chapfoody-api';

/**
 * Milestone currently implemented, surfaced by `/health` and `/v1/meta` so that a
 * deployed instance states what it is running (bumped as the plan progresses).
 */
export const CURRENT_MILESTONE = 'M1';

/** Global route prefix for the versioned API. Health probes are excluded. */
export const API_PREFIX = 'v1';
