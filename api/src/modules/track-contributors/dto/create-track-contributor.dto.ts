import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
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
}
