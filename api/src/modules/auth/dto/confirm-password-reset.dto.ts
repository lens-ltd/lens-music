import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmPasswordResetDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
