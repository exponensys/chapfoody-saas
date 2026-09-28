import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { MAX_PASSWORD_LENGTH } from '../password-policy.js';

/**
 * Registration input.
 *
 * ── Why the length rules are NOT here ────────────────────────────────────────
 * The password policy lives in `password-policy.ts` and produces a message that says what to change
 * ("au moins 12 caractères", "ne doit pas contenir votre nom"), whereas a DTO constraint produces the
 * pipe's generic "données invalides" plus a constraint name. Putting the minimum here as well would mean
 * two sources for one rule, and the user would get whichever fired first.
 *
 * `MaxLength` IS here because it is a body-size guard rather than a policy: it rejects a huge payload
 * before the request reaches the service. The service checks the same bound again before hashing, so the
 * expensive step is never reached with an oversized input either way.
 */
export class RegisterDto {
  @ApiProperty({ example: 'restaurant@email.com' })
  @IsEmail({}, { message: 'Adresse e-mail invalide.' })
  @MaxLength(320)
  email!: string;

  @ApiProperty({ example: 'une phrase de passe correcte' })
  @IsString()
  @MinLength(1, { message: 'Le mot de passe est requis.' })
  @MaxLength(MAX_PASSWORD_LENGTH)
  password!: string;

  @ApiProperty({ example: 'Awa' })
  @IsString()
  @MinLength(1, { message: 'Le prénom est requis.' })
  @MaxLength(120)
  firstName!: string;

  @ApiProperty({ example: 'Diallo' })
  @IsString()
  @MinLength(1, { message: 'Le nom est requis.' })
  @MaxLength(120)
  lastName!: string;
}

/** The token out of a verification link. */
export class VerifyEmailDto {
  @ApiProperty({ description: 'The token from the verification e-mail.' })
  @IsString()
  @MinLength(1)
  @MaxLength(512)
  token!: string;
}

/**
 * Password change input.
 *
 * `currentPassword` is optional because an account created through Google has none — for it, this is
 * SETTING a password rather than changing one, and there is nothing to confirm.
 */
export class ChangePasswordDto {
  @ApiProperty({ required: false, example: 'Resto123#@!$' })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_PASSWORD_LENGTH)
  currentPassword?: string;

  @ApiProperty({ example: 'une nouvelle phrase de passe' })
  @IsString()
  @MinLength(1, { message: 'Le nouveau mot de passe est requis.' })
  @MaxLength(MAX_PASSWORD_LENGTH)
  newPassword!: string;
}
