import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ContributorType, ContributorVerificationStatus } from '../../../constants/contributor.constants';
import { Gender } from '../../../constants/person.constants';
import { UserStatus } from '../../../constants/user.constants';
import { ContributorProfileLinkItemDto } from './contributor-profile-link.dto';
import { UUID } from '../../../types/common.types';

export class CreateContributorDto {
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

  @IsNotEmpty()
  @IsString()
  displayName!: string;

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

  @IsOptional()
  @IsEnum(ContributorType)
  type?: ContributorType;

  @IsOptional()
  @IsUUID()
  parentContributorId?: UUID;
}
