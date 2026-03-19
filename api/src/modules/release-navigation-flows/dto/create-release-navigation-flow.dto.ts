import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReleaseNavigationFlowDto {
  @IsNotEmpty()
  @IsUUID()
  releaseId!: string;

  @IsNotEmpty()
  @IsUUID()
  staticReleaseNavigationId!: string;
}
