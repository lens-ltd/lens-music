import {
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import {
  ReleaseType,
} from '../../../constants/release.constants';

export class CreateReleaseDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsEnum(ReleaseType)
  type!: ReleaseType;
}
