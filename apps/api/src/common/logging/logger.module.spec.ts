import type { IncomingMessage, ServerResponse } from 'node:http';

import { loadEnv } from '../../config/env.js';
import { REQUEST_ID_HEADER } from '../http/request-id.js';
import { buildPinoHttpOptions, createLoggerModule } from './logger.module.js';

/** Minimal request/response doubles for `genReqId`. */
function doubles(initialRequestId?: string) {
  const headers: Record<string, string> = {};
  const request = { headers, requestId: initialRequestId } as unknown as IncomingMessage;
  const setHeader = jest.fn();
  const response = { setHeader } as unknown as ServerResponse;

  return { request, response, setHeader };
}

describe('buildPinoHttpOptions', () => {
  it('uses the configured log level', () => {
    expect(buildPinoHttpOptions(loadEnv({ LOG_LEVEL: 'warn' })).level).toBe('warn');
    expect(buildPinoHttpOptions(loadEnv({ NODE_ENV: 'test' })).level).toBe('silent');
  });

  it('redacts credentials, so a token can never reach the log stream', () => {
    const redact = buildPinoHttpOptions(loadEnv({}))?.redact;

    expect(redact).toMatchObject({
      paths: expect.arrayContaining([
        'req.headers.authorization',
        'req.headers.cookie',
        'res.headers["set-cookie"]',
      ]),
      remove: true,
    });
  });

  it('silences the access log for health probes only', () => {
    const options = buildPinoHttpOptions(loadEnv({}));
    const autoLogging = options?.autoLogging as { ignore: (req: IncomingMessage) => boolean };

    expect(autoLogging.ignore({ url: '/health' } as IncomingMessage)).toBe(true);
    expect(autoLogging.ignore({ url: '/health/db' } as IncomingMessage)).toBe(true);
    expect(autoLogging.ignore({ url: '/v1/meta' } as IncomingMessage)).toBe(false);
  });

  it('pretty-prints in development only, so production stays machine-readable', () => {
    expect(buildPinoHttpOptions(loadEnv({ NODE_ENV: 'development' }))?.transport).toMatchObject({
      target: 'pino-pretty',
    });
    expect(
      buildPinoHttpOptions(
        loadEnv({
          NODE_ENV: 'production',
          DATABASE_URL: 'postgresql://x',
          // Production refuses to boot without two distinct signing secrets since M3, so a test that
          // wants a production environment has to be a realistic one.
          JWT_ACCESS_SECRET: 'a'.repeat(40),
          JWT_REFRESH_SECRET: 'b'.repeat(40),
          MFA_ENCRYPTION_KEY: 'c'.repeat(40),
        }),
      )?.transport,
    ).toBeUndefined();
  });

  it('stamps every record with the service name and milestone', () => {
    const options = buildPinoHttpOptions(loadEnv({}));
    const customProps = options?.customProps as () => Record<string, unknown>;

    expect(customProps()).toEqual({ service: 'chapfoody-api', milestone: 'M3' });
  });
});

describe('genReqId', () => {
  const getGenReqId = (): ((req: IncomingMessage, res: ServerResponse) => string) =>
    buildPinoHttpOptions(loadEnv({}))?.genReqId as (
      req: IncomingMessage,
      res: ServerResponse,
    ) => string;

  it('reuses an id already resolved by the middleware, so ordering does not matter', () => {
    const { request, response, setHeader } = doubles('already-resolved');

    expect(getGenReqId()(request, response)).toBe('already-resolved');
    // The header is still set, so the two implementations converge on one value.
    expect(setHeader).toHaveBeenCalledWith(REQUEST_ID_HEADER, 'already-resolved');
  });

  it('resolves one from the request header when nothing has run yet', () => {
    const { request, response } = doubles();
    request.headers[REQUEST_ID_HEADER] = 'from-the-edge';

    expect(getGenReqId()(request, response)).toBe('from-the-edge');
  });

  it('generates an id and stores it on the request when none is available', () => {
    const { request, response, setHeader } = doubles();
    const requestId = getGenReqId()(request, response);

    expect(requestId).toMatch(/^[0-9a-f-]{36}$/);
    expect((request as IncomingMessage & { requestId?: string }).requestId).toBe(requestId);
    expect(setHeader).toHaveBeenCalledWith(REQUEST_ID_HEADER, requestId);
  });
});

describe('createLoggerModule', () => {
  it('returns a Nest dynamic module', () => {
    expect(createLoggerModule(loadEnv({}))).toMatchObject({ module: expect.any(Function) });
  });
});
