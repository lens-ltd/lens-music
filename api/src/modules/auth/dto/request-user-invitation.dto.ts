import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RequestUserInvitationDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
