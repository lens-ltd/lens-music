import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class UpdateReleaseTerritoryDetailDto {
  @IsOptional()
  @IsString()
  @Length(2, 2)
  territory?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  displayArtistName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  labelName?: string;
}
