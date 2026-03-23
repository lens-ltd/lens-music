import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class ListUsersQueryDto {
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
}
