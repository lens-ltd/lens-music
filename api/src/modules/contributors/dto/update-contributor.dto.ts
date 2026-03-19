import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ContributorVerificationStatus } from '../../../constants/contributor.constants';
import { Gender } from '../../../constants/person.constants';
import { UserStatus } from '../../../constants/user.constants';
import { ContributorProfileLinkItemDto } from './contributor-profile-link.dto';

export class UpdateContributorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContributorProfileLinkItemDto)
  profileLinks?: ContributorProfileLinkItemDto[];

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsEnum(ContributorVerificationStatus)
  verificationStatus?: ContributorVerificationStatus;
}
