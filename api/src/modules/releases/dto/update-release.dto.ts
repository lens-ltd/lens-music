import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  ReleaseParentalAdvisory,
  ReleaseStatus,
  ReleaseType,
} from '../../../constants/release.constants';

export class UpdateReleaseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  upc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  catalogNumber?: string;

  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  titleVersion?: string;

  @IsOptional()
  @IsString()
  labelId?: string;

  @IsOptional()
  @IsInt()
  productionYear?: number;

  @IsOptional()
  @IsEnum(ReleaseType)
  releaseType?: ReleaseType;

  @IsOptional()
  @IsString()
  primaryLanguage?: string;

  @IsOptional()
  @IsObject()
  cLine?: { year: number; owner: string } | null;

  @IsOptional()
  @IsObject()
  pLine?: { year: number; owner: string } | null;

  @IsOptional()
  @IsDateString()
  originalReleaseDate?: string;

  @IsOptional()
  @IsDateString()
  digitalReleaseDate?: string;

  @IsOptional()
  @IsDateString()
  preorderDate?: string;

  @IsOptional()
  @IsEnum(ReleaseParentalAdvisory)
  parentalAdvisory?: ReleaseParentalAdvisory;

  @IsOptional()
  @IsEnum(ReleaseStatus)
  status?: ReleaseStatus;

  @IsOptional()
  @IsString()
  metadataLanguage?: string;

  @IsOptional()
  @IsArray()
  territories?: string[];
}
