import { Logger } from '@nestjs/common';

/**
 * Jest global setup — runs before every test file, and before any test imports
 * application code (which is why the environment is settled here rather than inside
 * the specs).
 */
process.env.NODE_ENV = 'test';

// Silent unless a test explicitly raises the level: a failing assertion should be
// the only thing filling the terminal. Set LOG_LEVEL=debug to see Nest/pino output.
process.env.LOG_LEVEL = process.env.LOG_LEVEL ?? 'silent';

// Nest's own logger is independent of pino and would still print, so it is turned
// off entirely. A spec that needs to observe logging spies on Logger itself.
Logger.overrideLogger(false);

// Make the external-dependency state deterministic.
//
// The configuration module reads `process.env` when it is imported, so a developer
// with a real DATABASE_URL in their shell would otherwise get different results from
// CI. Removing them here means the unit and e2e suites always exercise the
// "dependency absent" paths they assert on, while the integration specs connect
// using explicit INTEGRATION_* URLs (see test/helpers/availability.ts).
delete process.env.DATABASE_URL;
delete process.env.DIRECT_URL;
delete process.env.REDIS_URL;
