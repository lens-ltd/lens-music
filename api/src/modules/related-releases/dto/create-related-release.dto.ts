import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { RelatedReleaseRelationType } from '../../../constants/related-release.constants';
import { UUID } from '../../../types/common.types';

export class CreateRelatedReleaseDto {
  @IsOptional()
  @IsUUID()
  relatedReleaseId?: UUID;

  @IsNotEmpty()
  @IsEnum(RelatedReleaseRelationType)
  relationType!: RelatedReleaseRelationType;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  externalId?: string;
}
