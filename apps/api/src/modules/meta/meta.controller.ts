import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../auth/auth.decorators.js';
import { buildMetaPayload, type MetaResponseBody } from './meta.payloads.js';

/**
 * Public metadata about this deployment.
 *
 * Served under the `/v1` prefix, so the route is `GET /v1/meta` — exactly the URL
 * the M0 placeholder exposed, which keeps the contract stable across the
 * migration to NestJS.
 *
 * `@Public()` because it is deliberately open: it describes the deployment (the
 * running milestone and the supported business categories), which the marketing
 * site needs before anyone has signed in.
 */
@ApiTags('meta')
@Public()
@Controller('meta')
export class MetaController {
  @Get()
  @ApiOperation({
    summary: 'Platform metadata',
    description: 'Running milestone and the ten supported business categories.',
  })
  get(): MetaResponseBody {
    return buildMetaPayload();
  }
}
