import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import type { ApiEnv } from '../../config/env.js';
import { API_ENV } from '../../config/env.token.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { TokenService } from './token.service.js';

/**
 * Authentication.
 *
 * ── The guard is registered globally, and that is the point ──────────────────
 * `APP_GUARD` protects every route in the application, including routes in modules that know nothing
 * about this one. The alternative — `@UseGuards(JwtAuthGuard)` on each controller — makes an
 * unprotected endpoint the default outcome of forgetting a decorator, and a forgotten decorator does
 * not fail a test or a review. Here the default is protected and a public route has to SAY it is
 * public, which is a decision somebody has to make on purpose.
 *
 * ── The signing key comes from the validated environment ─────────────────────
 * `registerAsync` reads `API_ENV`, so the secret still has one source of truth and `loadEnv` has
 * already refused to boot if it is missing or too short in production. Nothing in this module reads
 * `process.env`.
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [API_ENV],
      useFactory: (env: ApiEnv) => ({
        secret: env.auth.accessSecret,
        signOptions: {
          expiresIn: env.auth.accessTtlSeconds,
          // Named explicitly rather than left to the library's default: the algorithm is a security
          // parameter, and `alg: none` and HS/RS confusion attacks both begin with a default nobody
          // wrote down.
          algorithm: 'HS256',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    TokenService,
    AuthService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
  // Exported so later milestones can reuse the guard's principal and the session machinery rather
  // than re-deriving either — `EntitlementGuard` and `TenantGuard` are built on top of these.
  exports: [TokenService, AuthService],
})
export class AuthModule {}
