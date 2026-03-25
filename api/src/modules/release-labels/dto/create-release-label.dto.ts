import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { UUID } from "../../../types/common.types";
import { ReleaseLabelType } from "../../../constants/release-label.constants";

export class CreateReleaseLabelDto {
  @IsUUID()
  @IsNotEmpty()
  labelId!: UUID;

  @IsOptional()
  @IsEnum(ReleaseLabelType)
  type?: ReleaseLabelType;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  ownership?: string;
}
