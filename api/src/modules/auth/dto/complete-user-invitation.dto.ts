import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CompleteUserInvitationDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
