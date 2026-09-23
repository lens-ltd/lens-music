import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PhoneNumberField } from '../../../helpers/phone.helper';

export class RequestUserInvitationDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @PhoneNumberField()
  phoneNumber?: string | null;
}
