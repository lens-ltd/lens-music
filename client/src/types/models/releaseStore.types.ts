import { AbstractEntity } from './index.types';
import { Store } from './store.types';

export enum ReleaseDeliveryStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

export interface ReleaseStore extends AbstractEntity {
  releaseId: string;
  storeId: string;
  deliveryStatus: ReleaseDeliveryStatus;
  createdById?: string;
  store?: Store;
}
