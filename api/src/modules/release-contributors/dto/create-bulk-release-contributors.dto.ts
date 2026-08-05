import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsUUID,
} from "class-validator";
import { ContributorRole } from "../../../constants/contributor.constants";

export class CreateBulkReleaseContributorsDto {
  @IsUUID()
  releaseId!: string;

  @IsUUID()
  contributorId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEnum(ContributorRole, { each: true })
  roles!: ContributorRole[];
}
