import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ReleaseStatus } from '../../../constants/release.constants';

export class ListReleasesQueryDto {
  @IsOptional()
  @IsUUID()
  createdById?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  page = 0;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  size = 10;

  @IsOptional()
  @IsEnum(ReleaseStatus)
  status?: ReleaseStatus;

  @IsOptional()
  @IsDateString()
  digitalReleaseDateFrom?: string;

  @IsOptional()
  @IsDateString()
  digitalReleaseDateTo?: string;

  /** Matches the release title or UPC. */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  searchKey?: string;
}
