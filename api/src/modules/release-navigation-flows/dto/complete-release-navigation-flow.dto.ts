import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CompleteReleaseNavigationFlowDto {
  @IsNotEmpty()
  @IsBoolean()
  isCompleted!: boolean;
}
