import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { ReleaseParentalAdvisory } from "../../../constants/release.constants";

export class UpdateTrackDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleVersion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  isrc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  iswc?: string;

  @IsOptional()
  @IsInt()
  discNumber?: number;

  @IsOptional()
  @IsInt()
  trackNumber?: number;

  @IsOptional()
  @IsInt()
  durationMs?: number;

  @IsOptional()
  @IsString()
  bpm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  musicalKey?: string;

  @IsOptional()
  @IsEnum(ReleaseParentalAdvisory)
  parentalAdvisory?: ReleaseParentalAdvisory;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  primaryLanguage?: string;

  @IsOptional()
  @IsInt()
  previewStartMs?: number;

  @IsOptional()
  @IsBoolean()
  isBonusTrack?: boolean;

  @IsOptional()
  @IsBoolean()
  isHiddenTrack?: boolean;

  @IsOptional()
  @IsInt()
  cLineYear?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  cLineOwner?: string;

  @IsOptional()
  @IsInt()
  pLineYear?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  pLineOwner?: string;
}
