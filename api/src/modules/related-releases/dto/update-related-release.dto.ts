import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { RelatedReleaseRelationType } from '../../../constants/related-release.constants';
import { UUID } from '../../../types/common.types';

export class UpdateRelatedReleaseDto {
  @IsOptional()
  @IsUUID()
  relatedReleaseId?: UUID;

  @IsOptional()
  @IsEnum(RelatedReleaseRelationType)
  relationType?: RelatedReleaseRelationType;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  externalId?: string;
}
