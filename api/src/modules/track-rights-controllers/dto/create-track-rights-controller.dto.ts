import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";
import { UUID } from "../../../types/common.types";
import { RightType } from "../../../constants/ddex.constants";

export class CreateTrackRightsControllerDto {
  @IsOptional()
  @IsUUID()
  contributorId?: UUID;

  @IsOptional()
  @IsUUID()
  labelId?: UUID;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  controllerName!: string;

  @IsNotEmpty()
  @IsEnum(RightType)
  rightType!: RightType;

  @IsArray()
  @IsString({ each: true })
  territories!: string[];

  @IsOptional()
  @IsString()
  rightSharePercentage?: string;

  @IsOptional()
  delegatedUsageRights?: Record<string, unknown>;
}
