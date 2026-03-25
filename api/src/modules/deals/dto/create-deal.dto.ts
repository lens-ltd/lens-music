import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
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

export class CreateDealDto {
  @IsOptional()
  @IsUUID()
  storeId?: UUID;

  @IsNotEmpty()
  @IsEnum(CommercialModelType)
  commercialModelType!: CommercialModelType;

  @IsNotEmpty()
  @IsEnum(UseType)
  useType!: UseType;

  @IsArray()
  @IsString({ each: true })
  territories!: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludedTerritories?: string[];

  @IsNotEmpty()
  @IsDateString()
  startDate!: string;

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
