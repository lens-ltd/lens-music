import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";
import { UUID } from "../../../types/common.types";
import {
  CommercialModelType,
  UseType,
  PriceType,
} from "../../../constants/ddex.constants";

export class UpdateDealDto {
  @IsOptional()
  @IsUUID()
  storeId?: UUID;

  @IsOptional()
  @IsEnum(CommercialModelType)
  commercialModelType?: CommercialModelType;

  @IsOptional()
  @IsEnum(UseType)
  useType?: UseType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  territories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludedTerritories?: string[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsDateString()
  preorderDate?: string;

  @IsOptional()
  @IsEnum(PriceType)
  priceType?: PriceType;

  @IsOptional()
  @IsString()
  priceAmount?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  priceCurrency?: string;

  @IsOptional()
  @IsDateString()
  takedownDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  takedownReason?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
