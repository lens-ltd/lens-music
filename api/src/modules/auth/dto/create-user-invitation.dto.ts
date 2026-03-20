import { IsEmail } from 'class-validator';

export class CreateUserInvitationDto {
  @IsEmail()
  email: string;
}
