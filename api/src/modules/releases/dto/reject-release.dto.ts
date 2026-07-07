import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RejectReleaseDto {
  @IsString()
  @IsNotEmpty({ message: 'Review feedback is required when rejecting a release' })
  @MaxLength(2000)
  reviewNotes!: string;
}
