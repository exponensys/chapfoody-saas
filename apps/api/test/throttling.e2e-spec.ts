import {
  Controller,
  Get,
  Module,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { SkipThrottle, Throttle, ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';
import request from 'supertest';

import { configureApp } from '../src/configure-app.js';
import { loadEnv } from '../src/config/env.js';

/**
 * Rate limiting, with the limits switched ON.
 *
 * The real `AppModule` turns throttling off in the test environment, because the suites that check
 * cookies, guards and validation make many requests from one address and would be rate-limited by a
 * component they are not testing. That leaves the limits themselves unexercised, which is the gap this
 * file closes: it mounts the same guard, in the same position, with small limits and asserts what the
 * limit is FOR.
 *
 * `configureApp` is the production one, so the 429 that arrives is the real error envelope a client
 * would see, not a lookalike.
 */
@Controller('probe')
class ThrottleProbeController {
  @Throttle({ default: { ttl: seconds(60), limit: 2 } })
  @Get('limited')
  limited(): { ok: true } {
    return { ok: true };
  }

  /** Unmetered, the way a health probe has to be. */
  @SkipThrottle()
  @Get('exempt')
  exempt(): { ok: true } {
    return { ok: true };
  }
}

/** Counts how often the later guard ran, so the ordering can be asserted rather than assumed. */
const guardRan = { count: 0 };

/**
 * Stands in for the authentication guards.
 *
 * It rejects with 401 unless a header is present, which is what makes the ordering observable: a request
 * carrying the header gets through, and a request without it has two possible answers — 401 if this guard
 * ran, 429 if the limiter refused the request first. The status IS the proof of which guard went first.
 */
class RecordingGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    guardRan.count += 1;

    const request = context.switchToHttp().getRequest<{ headers: Record<string, string> }>();

    if (request.headers['x-test-token'] === undefined) {
      throw new UnauthorizedException('Authentification requise.');
    }

    return true;
  }
}

@Module({
  imports: [ThrottlerModule.forRoot({ throttlers: [{ ttl: seconds(60), limit: 100 }] })],
  controllers: [ThrottleProbeController],
  providers: [
    // Same relative order as the real application: the limiter, then the rest.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: RecordingGuard },
  ],
})
class ThrottleProbeModule {}

describe('rate limiting (e2e)', () => {
  let app: Awaited<ReturnType<typeof build>>;

  /**
   * A fresh application per test.
   *
   * The storage is in-process and the window is sixty seconds, so a shared instance would let one test
   * spend the next one's budget — which is exactly what happened on the first run, and it presented as
   * "the limiter refuses everything" rather than as a test-ordering problem.
   */
  const build = async () => {
    const moduleRef = await Test.createTestingModule({ imports: [ThrottleProbeModule] }).compile();
    const created = moduleRef.createNestApplication({ logger: false });

    configureApp(created, loadEnv(), { withSwagger: false });
    await created.init();

    return created;
  };

  /** The later guard's credential, so a request gets past it unless the test is about it. */
  const authorised = { 'x-test-token': 'anything' };

  beforeEach(async () => {
    guardRan.count = 0;
    app = await build();
  });

  afterEach(async () => {
    await app.close();
  });

  it('allows requests up to the limit and refuses the one after it', async () => {
    await request(app.getHttpServer()).get('/v1/probe/limited').set(authorised).expect(200);
    await request(app.getHttpServer()).get('/v1/probe/limited').set(authorised).expect(200);

    // The third is over a limit of two.
    await request(app.getHttpServer()).get('/v1/probe/limited').set(authorised).expect(429);
  });

  it('answers a throttled request with the standard error envelope', async () => {
    await request(app.getHttpServer()).get('/v1/probe/limited').set(authorised);
    await request(app.getHttpServer()).get('/v1/probe/limited').set(authorised);

    const response = await request(app.getHttpServer())
      .get('/v1/probe/limited')
      .set(authorised)
      .expect(429);

    // 429 maps to RATE_LIMITED, so a client can branch on `code` rather than on a status and a message.
    expect(response.body).toMatchObject({
      code: 'RATE_LIMITED',
      path: '/v1/probe/limited',
      requestId: expect.any(String),
      timestamp: expect.any(String),
    });
  });

  it('refuses the flood BEFORE any later guard runs', async () => {
    // The entire reason the limiter is registered first. The later guard 401s without its header, so the
    // status proves which one answered: 429 means the limiter refused before the guard was consulted.
    await request(app.getHttpServer()).get('/v1/probe/limited').set(authorised).expect(200);
    await request(app.getHttpServer()).get('/v1/probe/limited').set(authorised).expect(200);

    // Budget spent, and no credential: a 401 here would mean the guard ran first.
    await request(app.getHttpServer()).get('/v1/probe/limited').expect(429);
  });

  it('leaves an exempt route unmetered however hard it is hit', async () => {
    // Health probes are polled by the orchestrator every few seconds from one address. Throttling them
    // would make a load balancer kill healthy instances.
    for (let attempt = 0; attempt < 6; attempt += 1) {
      await request(app.getHttpServer()).get('/v1/probe/exempt').set(authorised).expect(200);
    }
  });

  it('does not count an exempt route against the limited one', async () => {
    await request(app.getHttpServer()).get('/v1/probe/exempt').set(authorised);
    await request(app.getHttpServer()).get('/v1/probe/exempt').set(authorised);
    await request(app.getHttpServer()).get('/v1/probe/exempt').set(authorised);

    // The limited route still has its full budget.
    await request(app.getHttpServer()).get('/v1/probe/limited').set(authorised).expect(200);
  });
});
