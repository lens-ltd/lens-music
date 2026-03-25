import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsUUID, Min } from "class-validator";
import { UUID } from "../../../types/common.types";
import { ContributorRole } from "../../../constants/contributor.constants";

export class CreateTrackContributorDto {
  @IsUUID()
  @IsNotEmpty()
  trackId!: UUID;

  @IsUUID()
  @IsNotEmpty()
  contributorId!: UUID;

  @IsEnum(ContributorRole)
  @IsNotEmpty()
  role!: ContributorRole;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sequenceNumber?: number;
}
