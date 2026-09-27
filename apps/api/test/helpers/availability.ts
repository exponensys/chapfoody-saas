import { createConnection } from 'node:net';

/**
 * Availability probes for the integration specs.
 *
 * Several tests genuinely need PostgreSQL or Redis. Docker is not available in every
 * environment (it is absent from the machine this milestone was built on), so rather
 * than pretending — or letting a missing daemon look like a broken build — those
 * specs are skipped with a visible reason.
 *
 * CI provides both services, so the suite runs in full there; see
 * docs/runbooks/repository-setup.md.
 */

/** Reports whether a TCP endpoint accepts a connection within `timeoutMs`. */
export function canConnect(host: string, port: number, timeoutMs = 1_000): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = createConnection({ host, port });
    let settled = false;

    const finish = (reachable: boolean): void => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(reachable);
    };

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
  });
}

export interface IntegrationTarget {
  configured: boolean;
  reachable: boolean;
  reason: string;
}

async function probeUrl(url: string | undefined, label: string): Promise<IntegrationTarget> {
  if (url === undefined) {
    return {
      configured: false,
      reachable: false,
      reason: `${label} is not configured — skipping the integration suite.`,
    };
  }

  const parsed = new URL(url);
  const reachable = await canConnect(parsed.hostname, parsed.port ? Number(parsed.port) : 5432);

  return {
    configured: true,
    reachable,
    reason: reachable
      ? `${label} is reachable.`
      : `${label} is configured but unreachable — skipping the integration suite (is the service running?).`,
  };
}

export function probeDatabase(url = process.env.DATABASE_URL): Promise<IntegrationTarget> {
  return probeUrl(url, 'PostgreSQL (DATABASE_URL)');
}

export async function probeRedis(url = process.env.REDIS_URL): Promise<IntegrationTarget> {
  if (url === undefined) {
    return {
      configured: false,
      reachable: false,
      reason: 'Redis (REDIS_URL) is not configured — skipping the integration suite.',
    };
  }

  const parsed = new URL(url);
  const reachable = await canConnect(parsed.hostname, parsed.port ? Number(parsed.port) : 6379);

  return {
    configured: true,
    reachable,
    reason: reachable
      ? 'Redis is reachable.'
      : 'Redis is configured but unreachable — skipping the integration suite (is the service running?).',
  };
}

/** Prints the skip reason so a skipped suite is never silently invisible. */
export function reportSkip(reason: string): void {
  process.stdout.write(`\n⏭  ${reason}\n`);
}
