import { Body, Controller, Get, Module, Post } from '@nestjs/common';
import { IsEmail, IsInt, Min } from 'class-validator';

/**
 * Test-only probe controller.
 *
 * M1 ships no DTO-bearing endpoint of its own (authentication arrives in M3), so the
 * global ValidationPipe and the unhandled-error branch of the exception filter would
 * otherwise be unprovable end to end.
 *
 * Mounted on the **real** application through `createTestApp`, which applies the
 * production `configureApp` — so what these routes exercise is the same global pipe,
 * filter and prefix that production uses, not a lookalike.
 */
export class ProbeDto {
  @IsEmail()
  email!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

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
