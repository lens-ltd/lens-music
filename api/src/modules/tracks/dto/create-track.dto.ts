import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { UUID } from "../../../types/common.types";

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  titleVersion?: string;

  @IsUUID()
  @IsNotEmpty()
  releaseId!: UUID;
}
