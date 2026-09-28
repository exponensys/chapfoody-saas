import { Body, Controller, Get, Module, Post } from '@nestjs/common';
import { IsEmail, IsInt, Min } from 'class-validator';

import { Public } from '../../src/modules/auth/auth.decorators.js';

/**
 * Test-only probe controller.
 *
 * M1 shipped no DTO-bearing endpoint of its own, so the global ValidationPipe and the
 * unhandled-error branch of the exception filter would otherwise be unprovable end to
 * end. M3 now has a DTO-bearing endpoint of its own (`POST /auth/login`), but this
 * controller still earns its place for `/probe/boom`: the unhandled-error branch needs a
 * route that throws on purpose, and nothing in the product should do that.
 *
 * Mounted on the **real** application through `createTestApp`, which applies the
 * production `configureApp` — so what these routes exercise is the same global pipe,
 * filter and prefix that production uses, not a lookalike.
 *
 * `@Public()` because the global `JwtAuthGuard` would otherwise answer 401 before the
 * pipe or the filter ever ran — which is exactly what happened the moment the guard was
 * registered, and what these suites caught.
 */
export class ProbeDto {
  @IsEmail()
  email!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

@Public()
@Controller('probe')
export class ProbeController {
  @Post()
  create(@Body() dto: ProbeDto): { received: ProbeDto } {
    // Returning the DTO also proves `transform: true` produced a real class instance.
    return { received: dto };
  }

  @Get('boom')
  boom(): never {
    // An unexpected failure: the client must receive a generic message while the real
    // one is only logged. If the message below ever appears in a response, the filter
    // is leaking internals.
    throw new Error('internal detail that must never reach a client');
  }
}

@Module({ controllers: [ProbeController] })
export class ProbeModule {}
