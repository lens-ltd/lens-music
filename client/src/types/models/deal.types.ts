import type { AbstractEntity } from './index.types';
import type { Store } from './store.types';

export enum CommercialModelType {
  PAY_AS_YOU_GO = 'PAY_AS_YOU_GO',
  SUBSCRIPTION = 'SUBSCRIPTION',
  ADVERTISEMENT_SUPPORTED = 'ADVERTISEMENT_SUPPORTED',
  FREE = 'FREE',
}

export enum DealUseType {
  ON_DEMAND_STREAM = 'ON_DEMAND_STREAM',
  PERMANENT_DOWNLOAD = 'PERMANENT_DOWNLOAD',
  CONDITIONAL_DOWNLOAD = 'CONDITIONAL_DOWNLOAD',
  NON_INTERACTIVE_STREAM = 'NON_INTERACTIVE_STREAM',
  TETHERED_DOWNLOAD = 'TETHERED_DOWNLOAD',
}

export enum DealPriceType {
  WHOLESALE = 'WHOLESALE',
  RETAIL = 'RETAIL',
  SUGGESTED_RETAIL = 'SUGGESTED_RETAIL',
}

export interface Deal extends AbstractEntity {
  releaseId: string;
  storeId?: string;
  commercialModelType: CommercialModelType;
  useType: DealUseType;
  territories: string[];
  excludedTerritories?: string[];
  startDate: string;
  endDate?: string;
  preorderDate?: string;
  priceType?: DealPriceType;
  priceAmount?: string;
  priceCurrency?: string;
  takedownDate?: string;
  takedownReason?: string;
  isActive: boolean;
  store?: Store;
}

export interface CreateDealPayload {
  storeId?: string;
  commercialModelType: CommercialModelType;
  useType: DealUseType;
  territories: string[];
  excludedTerritories?: string[];
  startDate: string;
  endDate?: string;
  preorderDate?: string;
  priceType?: DealPriceType;
  priceAmount?: string;
  priceCurrency?: string;
  takedownDate?: string;
  takedownReason?: string;
  isActive?: boolean;
}

export type UpdateDealPayload = Partial<CreateDealPayload>;
