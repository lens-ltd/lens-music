import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsString,
} from 'class-validator';
import { countriesList } from '../../../constants/location.constant';

const COUNTRY_CODES = countriesList.map((country) => country.code);

export class UpdateReleaseTerritoriesDto {
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) => {
    if (!Array.isArray(value)) {
      return value;
    }

    return [...new Set(value.map((item) => String(item).trim().toUpperCase()))];
  })
  @IsString({ each: true })
  @IsIn(COUNTRY_CODES, { each: true, message: 'Each territory must be a valid ISO alpha-2 country code' })
  territories!: string[];
}
