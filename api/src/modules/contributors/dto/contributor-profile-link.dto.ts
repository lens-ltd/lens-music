import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContributorProfileLinkType } from '../../../constants/contributor.constants';

export class ContributorProfileLinkItemDto {
  @IsEnum(ContributorProfileLinkType)
  type!: ContributorProfileLinkType;

  @IsOptional()
  @IsString()
  url?: string;
}
