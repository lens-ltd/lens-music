import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';
import { UUID } from '../../../types/common.types';

export class AddReleaseLabelDto {
  @IsUUID()
  @IsNotEmpty()
  labelId!: UUID;

  @IsBoolean()
  isPrimary!: boolean;
}

export class DeleteReleaseLabelDto {
  @IsUUID()
  @IsNotEmpty()
  labelId!: UUID;
}
