import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CompleteUserInvitationDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
