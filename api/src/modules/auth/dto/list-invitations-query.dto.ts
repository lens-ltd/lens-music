import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { InvitationStatus } from '../../../constants/invitation.constants';

export class ListInvitationsQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === '') return 0;
    const n = Number(value);
    return Number.isNaN(n) ? 0 : n;
  })
  @IsInt()
  @Min(0)
  page = 0;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === '') return 10;
    const n = Number(value);
    return Number.isNaN(n) ? 10 : n;
  })
  @IsInt()
  @Min(1)
  size = 10;

  @IsOptional()
  @IsEnum(InvitationStatus)
  status?: InvitationStatus;
}
