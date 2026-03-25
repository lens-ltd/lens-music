import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class UpdateTrackContributorDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sequenceNumber?: number;
}
