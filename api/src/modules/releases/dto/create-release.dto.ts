import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReleaseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  upc?: string;

  @IsNotEmpty()
  @IsString()
  releaseDate: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsNotEmpty()
  @IsNumber()
  productionYear: number;

  @IsOptional()
  @IsString()
  labelId?: string;
}
