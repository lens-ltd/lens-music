import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ConfirmPasswordResetDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}
