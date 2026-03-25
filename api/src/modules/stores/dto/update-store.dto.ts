import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { DeliveryProtocol } from '../../../constants/ddex.constants';

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ddexPartyId?: string;

  @IsOptional()
  @IsEnum(DeliveryProtocol)
  deliveryProtocol?: DeliveryProtocol;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  deliveryEndpoint?: string;
}
