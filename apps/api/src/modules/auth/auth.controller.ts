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
import { MfaCodeDto, MfaVerifyDto } from './dto/mfa.dto.js';
import { MfaService } from './mfa.service.js';
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
 * What a correct password returns when the account has a second factor.
 *
 * No access token and no refresh cookie — only a challenge, which is the point. `mfaRequired` is a
 * literal so a client can distinguish the two responses without inferring it from a missing field.
 */
interface MfaRequiredResponseBody {
  mfaRequired: true;
  challengeToken: string;
  expiresInSeconds: number;
}

interface MfaEnrolmentResponseBody {
  secret: string;
  otpauthUri: string;
}

interface MfaConfirmationResponseBody {
  recoveryCodes: string[];
}

interface MfaStatusResponseBody {
  enabled: boolean;
  confirmedAt: string | null;
  recoveryCodesRemaining: number;
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
    private readonly mfa: MfaService,
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
  ): Promise<SessionResponseBody | MfaRequiredResponseBody> {
    const outcome = await this.auth.login({
      email: dto.email,
      password: dto.password,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    // The cookie is set INSIDE this branch, not before it. Setting it unconditionally is the mistake
    // that would hand out a refresh token to a caller who has only passed the first factor.
    if (outcome.kind === 'mfa_required') {
      return {
        mfaRequired: true,
        challengeToken: outcome.challengeToken,
        expiresInSeconds: outcome.expiresInSeconds,
      };
    }

    response.cookie(
      refreshCookieName(this.env),
      outcome.tokens.refreshToken,
      refreshCookieOptions(this.env, true),
    );

    return {
      accessToken: outcome.tokens.accessToken,
      expiresIn: outcome.tokens.accessExpiresInSeconds,
      mustChangePassword: outcome.user.mustChangePassword,
      user: outcome.user,
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

  // ── MFA ─────────────────────────────────────────────────────────────────────

  /**
   * The second step of a login.
   *
   * Public because the caller has no session yet — the challenge token IS the credential, issued only
   * after a correct password. It is the only place a challenge token is accepted.
   */
  @Public()
  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Complete a sign-in that requires a second factor',
    description: 'Exchanges a challenge token and a TOTP or recovery code for a session.',
  })
  async verifyMfa(
    @Body() dto: MfaVerifyDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SessionResponseBody> {
    const outcome = await this.auth.verifyMfa({
      challengeToken: dto.challengeToken,
      code: dto.code,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    // `verifyMfa` re-checks the account, so this is a session in every case that gets here.
    if (outcome.kind !== 'session') {
      throw AppException.unauthenticated('Vérification MFA expirée. Reconnectez-vous.');
    }

    response.cookie(
      refreshCookieName(this.env),
      outcome.tokens.refreshToken,
      refreshCookieOptions(this.env, true),
    );

    return {
      accessToken: outcome.tokens.accessToken,
      expiresIn: outcome.tokens.accessExpiresInSeconds,
      mustChangePassword: outcome.user.mustChangePassword,
      user: outcome.user,
    };
  }

  /** Starts enrolment. Requires a session, because it replaces any existing secret. */
  @Post('mfa/enroll')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Begin TOTP enrolment',
    description: 'Returns the secret and otpauth URI. Not active until confirmed with a code.',
  })
  enrollMfa(@CurrentUser() principal: AuthPrincipal): Promise<MfaEnrolmentResponseBody> {
    return this.mfa.beginEnrolment(principal.userId);
  }

  /**
   * Completes enrolment and returns the recovery codes.
   *
   * The ONLY response that ever contains them: only hashes are stored, so this cannot be repeated. The
   * client must show them before navigating away.
   */
  @Post('mfa/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Confirm TOTP enrolment',
    description: 'Activates MFA and returns the recovery codes. These are shown once, and never again.',
  })
  async confirmMfa(@CurrentUser() principal: AuthPrincipal, @Body() dto: MfaCodeDto): Promise<MfaConfirmationResponseBody> {
    return this.mfa.confirmEnrolment(principal.userId, dto.code);
  }

  /**
   * Turns MFA off.
   *
   * A code is required even though the caller is authenticated: disabling the second factor is exactly
   * what a stolen session would be used for.
   */
  @Post('mfa/disable')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Turn MFA off', description: 'Requires a current code from the device.' })
  async disableMfa(@CurrentUser() principal: AuthPrincipal, @Body() dto: MfaCodeDto): Promise<void> {
    await this.mfa.disable(principal.userId, dto.code);
  }

  /** Whether the account is protected, and how many recovery codes are left unspent. */
  @Get('mfa/status')
  @ApiOperation({ summary: 'The MFA state of the authenticated caller' })
  async mfaStatus(@CurrentUser() principal: AuthPrincipal): Promise<MfaStatusResponseBody> {
    const status = await this.mfa.status(principal.userId);

    return {
      enabled: status.enabled,
      confirmedAt: status.confirmedAt?.toISOString() ?? null,
      recoveryCodesRemaining: status.recoveryCodesRemaining,
    };
  }
}
