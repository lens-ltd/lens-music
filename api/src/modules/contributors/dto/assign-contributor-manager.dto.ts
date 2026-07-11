import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignContributorManagerDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;
}
