import { Type } from 'class-transformer';
import {
  IsDateString,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import {
  ReleaseParentalAdvisory,
  ReleaseType,
} from '../../../constants/release.constants';

class ReleaseRightsLineDto {
  @Type(() => Number)
  @IsDefined()
  @IsInt()
  year!: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  owner!: string;
}

export class UpdateReleaseOverviewDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsEnum(ReleaseType)
  type!: ReleaseType;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleVersion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  version?: string;

  @Type(() => Number)
  @IsInt()
  productionYear!: number;

  @IsDateString()
  originalReleaseDate!: string;

  @IsDateString()
  digitalReleaseDate!: string;

  @IsOptional()
  @IsDateString()
  preorderDate?: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => ReleaseRightsLineDto)
  cLine!: ReleaseRightsLineDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => ReleaseRightsLineDto)
  pLine!: ReleaseRightsLineDto;

  @IsEnum(ReleaseParentalAdvisory)
  parentalAdvisory!: ReleaseParentalAdvisory;

  @IsString()
  @IsNotEmpty()
  primaryLanguage!: string;
}
