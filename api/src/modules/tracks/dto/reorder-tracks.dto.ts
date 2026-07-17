import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

export class ReorderTracksDto {
  @IsUUID()
  releaseId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  trackIds: string[];
}
