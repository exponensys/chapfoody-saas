/**
 * Chapfoody API — M0 placeholder bootstrap.
 *
 * ⚠️ This is a MINIMAL stand-in, not the real API. It exists so that
 * `pnpm dev` really starts an API and so the workspace pipeline (build ·
 * typecheck · lint · test) is exercised on real code instead of on nothing.
 *
 * M1 replaces this file with the NestJS socle: typed ConfigModule, Prisma
 * module, global ValidationPipe, exception filter with the error envelope that
 * `@chapfoody/api-client` already expects (`{ code, message, details?,
 * requestId? }`), OpenAPI at /docs, and the BullMQ worker entrypoint.
 *
 * Endpoints kept from here into M1 (they are genuinely useful in production):
 *   GET /health    liveness probe
 *   GET /v1/meta   supported business categories, for the frontends
 */
import { createServer, type ServerResponse } from 'node:http';

import { loadEnv } from './env.js';
import { SERVICE_NAME, buildHealthPayload, buildMetaPayload } from './health.js';

const env = loadEnv();

function writeJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);

  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

const server = createServer((req, res) => {
  const method = req.method ?? 'GET';
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  if (method === 'GET' && url.pathname === '/health') {
    writeJson(res, 200, buildHealthPayload());
    return;
  }

  if (method === 'GET' && url.pathname === '/v1/meta') {
    writeJson(res, 200, buildMetaPayload());
    return;
  }

  // Same error envelope the client parses (packages/api-client/src/errors.ts).
  writeJson(res, 404, {
    code: 'NOT_FOUND',
    message: `No route matches ${method} ${url.pathname}.`,
  });
});

server.listen(env.port, () => {
  process.stdout.write(
    `${SERVICE_NAME} listening on http://localhost:${env.port} (${env.nodeEnv})\n` +
      `  GET /health     liveness\n` +
      `  GET /v1/meta    supported business categories\n`,
  );
});

// SIGINT (Ctrl-C) and SIGTERM (Docker, Kubernetes, Fly) must stop accepting new
// connections and exit cleanly, so a deploy never kills an in-flight request.
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    process.stdout.write(`\n${SERVICE_NAME}: ${signal} received, shutting down.\n`);
    server.close(() => process.exit(0));
  });
}
