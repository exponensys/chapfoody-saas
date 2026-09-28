import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

/**
 * MFA input.
 *
 * The code is pattern-checked rather than just length-checked, because the two shapes a caller can
 * legitimately send are a six-digit TOTP and a recovery code — and a stray value that is neither only
 * costs an Argon2 comparison per stored recovery code before being rejected.
 */
const TOTP_PATTERN = /^\d{6}$/;
const RECOVERY_CODE_PATTERN = /^[A-Za-z0-9]{5}-[A-Za-z0-9]{5}$/;

const CODE_PATTERN = { message: 'Code de vérification invalide.' } as const;

/** Confirms an enrolment, or turns MFA off. Only a TOTP code is accepted here. */
export class MfaCodeDto {
  @ApiProperty({ example: '123456', description: 'The six-digit code from the authenticator app.' })
  @IsString()
  @Matches(TOTP_PATTERN, CODE_PATTERN)
  code!: string;
}

/** The second step of a login. Accepts a TOTP code or one of the recovery codes. */
export class MfaVerifyDto {
  @ApiProperty({
    description: 'The challenge token returned by a login that reported mfaRequired.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(4096)
  challengeToken!: string;

  @ApiProperty({ example: '123456', description: 'A six-digit code, or a recovery code.' })
  @IsString()
  @MaxLength(32)
  @Matches(new RegExp(`${TOTP_PATTERN.source}|${RECOVERY_CODE_PATTERN.source}`), CODE_PATTERN)
  code!: string;
}
