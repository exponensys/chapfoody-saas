import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Login input.
 *
 * The password's `MaxLength` is not about the password policy — it is about Argon2: hashing is
 * memory-hard, so an unbounded password is a cheap way to make the server do expensive work. The
 * policy itself (length, breached-password check) belongs to registration, where it can be explained
 * to somebody; refusing to *sign in* with a password that no longer meets the policy would lock out
 * every account created before the policy changed.
 */
export class LoginDto {
  @ApiProperty({ example: 'restaurant@email.com' })
  @IsEmail({}, { message: 'Adresse e-mail invalide.' })
  @MaxLength(320)
  email!: string;

  @ApiProperty({ example: 'Resto123#@!$' })
  @IsString()
  @MinLength(1, { message: 'Le mot de passe est requis.' })
  @MaxLength(200)
  password!: string;
}
