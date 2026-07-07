import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RejectContributorDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
