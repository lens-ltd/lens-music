import { IsIn, IsOptional, IsString } from 'class-validator';
import { STATUSES } from '../../../constants/artist.constants';

export class UpdateArtistDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(Object.values(STATUSES))
  status?: string;
}
