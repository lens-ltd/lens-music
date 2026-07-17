import { IsNotEmpty, IsUUID } from 'class-validator';
import { UUID } from '../../../types/common.types';

export class AssignUserRoleDto {
  @IsUUID()
  @IsNotEmpty()
  roleId!: UUID;
}
