import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { ReleaseLabelType } from "../../../constants/release-label.constants";

export class UpdateReleaseLabelDto {
  @IsOptional()
  @IsEnum(ReleaseLabelType)
  type?: ReleaseLabelType;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  ownership?: string;
}
