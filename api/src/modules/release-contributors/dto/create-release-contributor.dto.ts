import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsUUID, Min } from "class-validator";
import { UUID } from "../../../types/common.types";
import { ContributorRole } from "../../../constants/contributor.constants";

export class CreateReleaseContributorDto {
  @IsUUID()
  @IsNotEmpty()
  releaseId!: UUID;

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
