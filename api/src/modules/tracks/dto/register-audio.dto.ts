import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class RegisterAudioDto {
  @IsUrl()
  @IsNotEmpty()
  secureUrl!: string;

  @IsString()
  @IsNotEmpty()
  publicId!: string;

  @IsInt()
  @Min(1)
  bytes!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationMs?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  sampleRate?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  bitDepth?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  channels?: number;

  @IsOptional()
  @IsString()
  format?: string;

  @IsString()
  @IsNotEmpty()
  originalName!: string;
}
