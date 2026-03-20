import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateContributorMembershipDto {
  @IsNotEmpty()
  @IsUUID()
  parentContributorId!: string;

  @IsNotEmpty()
  @IsUUID()
  memberContributorId!: string;
}
