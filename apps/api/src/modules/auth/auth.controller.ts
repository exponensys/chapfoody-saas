import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { AppException } from '../../common/errors/app.exception.js';
import type { ApiEnv } from '../../config/env.js';
import { API_ENV } from '../../config/env.token.js';
import { CurrentUser, Public } from './auth.decorators.js';
import { AuthService } from './auth.service.js';
import type { AuthPrincipal } from './auth.types.js';
import { LoginDto } from './dto/login.dto.js';
import {
  readRefreshCookie,
  refreshCookieName,
  refreshCookieOptions,
} from './refresh-cookie.js';

/** What a successful sign-in or refresh returns. The refresh token travels only in the cookie. */
interface SessionResponseBody {
  accessToken: string;
  expiresIn: number;
  mustChangePassword: boolean;
  user: unknown;
}

/**
 * Authentication endpoints.
 *
 * ── The refresh token is never in a response body ────────────────────────────
 * Login and refresh set it as an `httpOnly` cookie and return only the access token. A body would be
 * readable by any script on the page, which is exactly what the cookie is for — and returning both
 * would mean the cookie strategy was decorative.
 *
 * ── `/logout` and `/me` are guarded; `/login` and `/refresh` are not ─────────
 * That is not an inconsistency: login has no token yet, and refresh *is* the credential, presented as a
 * cookie rather than a header. Everything else in the application is protected by the global guard.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(API_ENV) private readonly env: ApiEnv,
    private readonly auth: AuthService,
  ) {}

  @Public()
  @Post('login')
  // 200, not the default 201: nothing is created at a stable URL, and a 201 with no Location header
  // makes clients and proxies guess.
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sign in with e-mail and password',
    description: 'Returns an access token and sets the httpOnly refresh cookie.',
  })
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SessionResponseBody> {
    const result = await this.auth.login({
      email: dto.email,
      password: dto.password,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    response.cookie(
      refreshCookieName(this.env),
      result.tokens.refreshToken,
      refreshCookieOptions(this.env, true),
    );

    return {
      accessToken: result.tokens.accessToken,
      expiresIn: result.tokens.accessExpiresInSeconds,
      mustChangePassword: result.user.mustChangePassword,
      user: result.user,
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Exchange the refresh cookie for a new access token',
    description: 'Rotates the refresh token. Replaying a spent token revokes the whole token family.',
  })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SessionResponseBody> {
    const presented = readRefreshCookie(this.env, request.headers.cookie);

    if (presented === undefined) {
      throw AppException.unauthenticated('Authentification requise.');
    }

    try {
      const result = await this.auth.refresh(presented, request.ip, request.headers['user-agent']);

      response.cookie(
        refreshCookieName(this.env),
        result.tokens.refreshToken,
        refreshCookieOptions(this.env, true),
      );

      return {
        accessToken: result.tokens.accessToken,
        expiresIn: result.tokens.accessExpiresInSeconds,
        mustChangePassword: result.user.mustChangePassword,
        user: result.user,
      };
    } catch (error) {
      // A refresh that fails for any reason clears the cookie: leaving a dead token in the browser
      // means every subsequent page load retries a refresh that cannot succeed.
      response.clearCookie(refreshCookieName(this.env), refreshCookieOptions(this.env, false));

      throw error;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'End the current session' })
  async logout(
    @CurrentUser() principal: AuthPrincipal,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.auth.logout(principal.sessionId);

    response.clearCookie(refreshCookieName(this.env), refreshCookieOptions(this.env, false));
  }

  @Get('me')
  @ApiOperation({ summary: 'The authenticated caller' })
  me(@CurrentUser() principal: AuthPrincipal): Promise<unknown> {
    return this.auth.me(principal.userId, principal.businessId);
  }
}
