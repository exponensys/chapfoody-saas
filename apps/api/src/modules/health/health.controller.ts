import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import type {
  DependencyHealthResponseBody,
  HealthResponseBody,
} from '../../common/errors/error-response.js';
import type { RequestWithId } from '../../common/http/request-id.js';
import { Public } from '../auth/auth.decorators.js';
import { buildLivenessPayload } from './health.payloads.js';
import { HealthService } from './health.service.js';

/**
 * Health probes.
 *
 * Three distinct questions, three endpoints — conflating them is how a liveness
 * probe ends up restarting a healthy pod because the database blinked:
 *
 *   GET /health        liveness  — is the process alive? Touches NOTHING external.
 *   GET /health/db     readiness — can we reach the database?
 *   GET /health/queue  readiness — is the background queue reachable (or off)?
 *
 * Status codes: 200 for `up`, `not-configured` and `disabled`; 503 only for `down`.
 * A dependency that was never configured is not a failure of this process — and in
 * production a missing DATABASE_URL already prevents boot (see config/env.ts), so
 * `not-configured` only ever appears in development and tests.
 *
 * All three are excluded from the global `/v1` prefix (see main.ts).
 *
 * `@Public()` because a probe that needs a token cannot answer the question it is
 * asked: an orchestrator has no credentials, and a liveness check that fails
 * while the process is healthy would restart it.
 */
@ApiTags('health')
@Public()
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Liveness probe',
    description: 'Reports that the process is running. Performs no dependency check.',
  })
  liveness(): HealthResponseBody {
    return buildLivenessPayload();
  }

  @Get('db')
  @ApiOperation({
    summary: 'Database readiness probe',
    description: 'Runs a `SELECT 1` round trip against PostgreSQL.',
  })
  async database(
    @Req() request: RequestWithId,
    @Res({ passthrough: true }) response: Response,
  ): Promise<DependencyHealthResponseBody> {
    const result = await this.health.checkDatabase(request.requestId);
    response.status(result.status === 'down' ? HttpStatus.SERVICE_UNAVAILABLE : HttpStatus.OK);

    return result;
  }

  @Get('queue')
  @ApiOperation({
    summary: 'Queue readiness probe',
    description: 'Runs a Redis round trip. Reports `disabled` when REDIS_URL is unset.',
  })
  async queue(
    @Req() request: RequestWithId,
    @Res({ passthrough: true }) response: Response,
  ): Promise<DependencyHealthResponseBody> {
    const result = await this.health.checkQueue(request.requestId);
    response.status(result.status === 'down' ? HttpStatus.SERVICE_UNAVAILABLE : HttpStatus.OK);

    return result;
  }
}
