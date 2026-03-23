import { ArrayMaxSize, ArrayMinSize, IsArray, IsEmail } from 'class-validator';

export class CreateBulkUserInvitationDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsEmail({}, { each: true })
  emails!: string[];
}
