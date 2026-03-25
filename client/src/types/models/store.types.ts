import { AbstractEntity } from './index.types';

export enum StoreDeliveryProtocol {
  SFTP = 'SFTP',
  HTTPS = 'HTTPS',
  API = 'API',
}

export interface Store extends AbstractEntity {
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  ddexPartyId?: string;
  deliveryProtocol?: StoreDeliveryProtocol;
  deliveryEndpoint?: string;
}

export interface UpdateStorePayload {
  ddexPartyId?: string;
  deliveryProtocol?: StoreDeliveryProtocol;
  deliveryEndpoint?: string;
}
