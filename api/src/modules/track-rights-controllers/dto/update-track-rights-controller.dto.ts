import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";
import { UUID } from "../../../types/common.types";
import { RightType } from "../../../constants/ddex.constants";

export class UpdateTrackRightsControllerDto {
  @IsOptional()
  @IsUUID()
  contributorId?: UUID;

  @IsOptional()
  @IsUUID()
  labelId?: UUID;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  controllerName?: string;

  @IsOptional()
  @IsEnum(RightType)
  rightType?: RightType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  territories?: string[];

  @IsOptional()
  @IsString()
  rightSharePercentage?: string;

  @IsOptional()
  delegatedUsageRights?: Record<string, unknown>;
}
