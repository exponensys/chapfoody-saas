/** Injection token for the BullMQ connection options (absent when the queue is off). */
export const QUEUE_CONNECTION = Symbol('QUEUE_CONNECTION');

/**
 * Queue names and job names.
 *
 * Centralised so that a producer and a consumer can never disagree about a
 * string literal, and so the set of queues is reviewable in one place.
 */
export const QUEUE_NAMES = {
  /** Platform-level maintenance jobs (health round-trip today, cleanup later). */
  system: 'system',
} as const;

export const SYSTEM_JOBS = {
  /** No-op job used to prove the worker is wired and consuming. */
  healthCheck: 'health-check',
} as const;

export type SystemJobName = (typeof SYSTEM_JOBS)[keyof typeof SYSTEM_JOBS];
