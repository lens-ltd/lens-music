import { AbstractEntity } from './index.types';
import { Store } from './store.types';

export enum ReleaseDeliveryStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

export enum DdexAcknowledgmentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  ERROR = 'ERROR',
}

export interface ReleaseStore extends AbstractEntity {
  releaseId: string;
  storeId: string;
  deliveryStatus: ReleaseDeliveryStatus;
  createdById?: string;
  ddexMessageId?: string;
  ddexMessageSentAt?: string;
  ddexAcknowledgmentStatus?: DdexAcknowledgmentStatus;
  ddexAcknowledgmentMessage?: string;
  ddexAcknowledgmentReceivedAt?: string;
  store?: Store;
}
