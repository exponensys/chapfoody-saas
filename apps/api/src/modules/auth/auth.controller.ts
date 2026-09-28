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
import { secretsMatch } from '../../infra/crypto/secret-box.js';
import { CurrentUser, Public } from './auth.decorators.js';
import { AuthService } from './auth.service.js';
import type { AuthPrincipal } from './auth.types.js';
import { LoginDto } from './dto/login.dto.js';
import { MfaCodeDto, MfaVerifyDto } from './dto/mfa.dto.js';
import {
  ChangePasswordDto,
  RegisterDto,
  VerifyEmailDto,
} from './dto/register.dto.js';
import { MfaService } from './mfa.service.js';
import {
  MFA_CHALLENGE_COOKIE,
  mfaChallengeCookieOptions,
  readMfaChallengeCookie,
} from './mfa-challenge-cookie.js';
import {
  OAUTH_STATE_COOKIE,
  newOAuthState,
  oauthStateCookieOptions,
  readOAuthState,
} from './google-state.js';
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

  // ── Registration ────────────────────────────────────────────────────────────

  /**
   * Creates an account.
   *
   * ── Why 202 and an empty body ───────────────────────────────────────────────
   * `201 Created` would be a lie half the time and, worse, a distinguishable one: the sign-up form would
   * become a free "is this address registered?" service. The response is identical whether the address was
   * new or already taken, so 202 — "accepted" — is the only status that is true in both cases.
   *
   * No session is opened. The address has not been proven yet, and the verification link is what proves
   * it; the app signs in afterwards.
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Create an account',
    description:
      'Sends a verification link. The response is identical whether or not the address was already registered.',
  })
  async register(@Body() dto: RegisterDto): Promise<void> {
    await this.auth.register(dto);
  }

  /** Proves an e-mail address. Public: the caller has no session yet, and the token is the credential. */
  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Verify an e-mail address', description: 'Consumes the token from the link.' })
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<void> {
    await this.auth.verifyEmail(dto.token);
  }

  /**
   * Changes the caller's password.
   *
   * Guarded rather than public: it acts on the account behind the session, and the service re-checks the
   * current password on top — a valid session alone must not be enough to lock the owner out.
   */
  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Change the password of the authenticated caller',
    description: 'Signs every other session out. Omits the current password only for accounts with none.',
  })
  async changePassword(
    @CurrentUser() principal: AuthPrincipal,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    await this.auth.changePassword(principal.userId, principal.sessionId, {
      currentPassword: dto.currentPassword,
      newPassword: dto.newPassword,
    });
  }

  // ── Google OAuth ────────────────────────────────────────────────────────────

  /**
   * Starts the Google flow.
   *
   * The state is generated here, stored in a cookie, and sent to Google in the URL. The callback
   * compares the two — see `google-state.ts` for what that prevents. It is the only thing standing
   * between this endpoint and a login-CSRF that signs a victim into an attacker's account.
   */
  @Public()
  @Get('google')
  @ApiOperation({
    summary: 'Start Google sign-in',
    description: 'Sets the anti-CSRF state cookie and redirects to the Google consent screen.',
  })
  startGoogle(@Res() response: Response): void {
    const state = newOAuthState();

    response.cookie(OAUTH_STATE_COOKIE, state, oauthStateCookieOptions(this.env, true));
    response.redirect(HttpStatus.FOUND, this.auth.googleAuthorizationUrl(state));
  }

  /**
   * Where Google returns the browser.
   *
   * ── Every failure ends in a redirect, not a JSON error ───────────────────────
   * This is a browser navigation, so a `401` would show the user a page of JSON. Each failure gets a
   * distinct `status` on the way back to the app, and none of them can produce a session — which is the
   * property that matters, and it is not weakened by being reported politely.
   *
   * ── No credential ever travels in the URL ───────────────────────────────────
   * The refresh token goes into its `httpOnly` cookie; an MFA challenge goes into a cookie of its own.
   * The redirect carries a status word and nothing else, so nothing sensitive lands in browser history,
   * session restore, or a `Referer` header.
   */
  @Public()
  @Get('google/callback')
  @ApiOperation({
    summary: 'Google OAuth callback',
    description: 'Verifies the state, exchanges the code, then redirects to the app with a status.',
  })
  async googleCallback(@Req() request: Request, @Res() response: Response): Promise<void> {
    const query = request.query as Record<string, string | undefined>;
    const expectedState = readOAuthState(request.headers.cookie);

    // Cleared on EVERY path, including success: the state is single-use, so replaying this URL after a
    // completed sign-in must find nothing left to match.
    response.clearCookie(OAUTH_STATE_COOKIE, oauthStateCookieOptions(this.env, false));

    const back = (status: string): void => {
      response.redirect(HttpStatus.FOUND, `${this.env.frontendUrl}/auth/callback?status=${status}`);
    };

    if (query['error'] !== undefined) {
      // The user pressed Cancel, or Google declined. Not worth an error status: the app shows a note and
      // the sign-in button again.
      back('denied');
      return;
    }

    const code = query['code'];
    const state = query['state'];

    if (
      code === undefined ||
      state === undefined ||
      expectedState === undefined ||
      // Constant time: a mismatch is a security event, and comparing with `===` would leak how much of a
      // guess was right.
      !secretsMatch(expectedState, state)
    ) {
      back('invalid_state');
      return;
    }

    try {
      const identity = await this.auth.exchangeGoogleCode(code);

      const outcome = await this.auth.loginWithGoogle(identity, {
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      });

      if (outcome.kind === 'mfa_required') {
        // The second factor is owed. The challenge rides in a cookie rather than the URL, and
        // `/auth/mfa/verify` accepts it from there.
        response.cookie(
          MFA_CHALLENGE_COOKIE,
          outcome.challengeToken,
          mfaChallengeCookieOptions(this.env, true),
        );

        back('mfa_required');
        return;
      }

      response.cookie(
        refreshCookieName(this.env),
        outcome.tokens.refreshToken,
        refreshCookieOptions(this.env, true),
      );

      // `status=ok` only means the refresh cookie was set. The app then calls POST /auth/refresh to get
      // an access token, which keeps the token out of the redirect entirely.
      back('ok');
    } catch {
      // A refused code, a forged ID token, a refused link, a suspended account: the app gets one status
      // and shows a message that does not distinguish them.
      back('failed');
    }
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
    // From the body for a password sign-in, or from the cookie for a Google one — where there was never
    // a request body to put it in. Both are the same token, issued by the same code.
    const challengeToken = dto.challengeToken ?? readMfaChallengeCookie(request.headers.cookie);

    if (challengeToken === undefined) {
      throw AppException.unauthenticated('Vérification MFA expirée. Reconnectez-vous.');
    }

    const outcome = await this.auth.verifyMfa({
      challengeToken,
      code: dto.code,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    // The challenge is single-use; clearing it here means a second attempt has to start from a sign-in
    // rather than replaying the same five-minute window.
    response.clearCookie(MFA_CHALLENGE_COOKIE, mfaChallengeCookieOptions(this.env, false));

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
