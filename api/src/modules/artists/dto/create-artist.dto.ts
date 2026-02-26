import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { STATUSES } from '../../../constants/artist.constants';

export class CreateArtistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsIn(Object.values(STATUSES))
  status?: string;
}
