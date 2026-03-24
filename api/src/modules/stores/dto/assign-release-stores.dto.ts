import { ArrayUnique, IsArray, IsUUID } from 'class-validator';
import { UUID } from '../../../types/common.types';

export class AssignReleaseStoresDto {
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  storeIds!: UUID[];
}
