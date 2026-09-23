import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { PhoneNumberField } from '../../../helpers/phone.helper';

export class CompleteUserInvitationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @PhoneNumberField()
  phoneNumber?: string | null;
}
