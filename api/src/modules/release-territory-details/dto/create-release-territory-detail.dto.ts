import { IsNotEmpty, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateReleaseTerritoryDetailDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  territory!: string;

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
