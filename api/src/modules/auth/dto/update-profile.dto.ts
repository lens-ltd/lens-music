import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { PhoneNumberField } from '../../../helpers/phone.helper';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @PhoneNumberField()
  phoneNumber?: string | null;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Current password must be at least 8 characters' })
  currentPassword?: string;
}
