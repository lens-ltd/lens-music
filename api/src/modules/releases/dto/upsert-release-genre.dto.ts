import { IsEnum, IsUUID } from 'class-validator';
import { ReleaseGenreType } from '../../../constants/release.constants';

export class UpsertReleaseGenreDto {
  @IsUUID()
  genreId!: string;

  @IsEnum(ReleaseGenreType)
  type!: ReleaseGenreType;
}
