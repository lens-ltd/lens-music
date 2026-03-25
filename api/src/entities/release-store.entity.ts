import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UUID } from '../types/common.types';
import { Release } from './release.entity';
import { Store } from './store.entity';
import { ReleaseDeliveryStatus } from '../constants/store.constants';
import { DdexAcknowledgmentStatus } from '../constants/ddex.constants';

@Entity('release_stores')
@Unique(['releaseId', 'storeId'])
export class ReleaseStore extends AbstractEntity {
  @Column({ name: 'release_id', type: 'uuid', nullable: false })
  releaseId!: UUID;

  @Column({ name: 'store_id', type: 'uuid', nullable: false })
  storeId!: UUID;

  @Column({
    name: 'delivery_status',
    type: 'enum',
    enum: ReleaseDeliveryStatus,
    nullable: false,
    default: ReleaseDeliveryStatus.PENDING,
  })
  deliveryStatus!: ReleaseDeliveryStatus;


  // DDEX MESSAGE ID
  @Column({ name: 'ddex_message_id', type: 'varchar', length: 255, nullable: true })
  ddexMessageId?: string;

  // DDEX MESSAGE SENT AT
  @Column({ name: 'ddex_message_sent_at', type: 'timestamptz', nullable: true })
  ddexMessageSentAt?: Date;

  // DDEX ACKNOWLEDGMENT STATUS
  @Column({
    name: 'ddex_acknowledgment_status',
    type: 'enum',
    enum: DdexAcknowledgmentStatus,
    nullable: true,
  })
  ddexAcknowledgmentStatus?: DdexAcknowledgmentStatus;

  // DDEX ACKNOWLEDGMENT MESSAGE
  @Column({ name: 'ddex_acknowledgment_message', type: 'text', nullable: true })
  ddexAcknowledgmentMessage?: string;

  // DDEX ACKNOWLEDGMENT RECEIVED AT
  @Column({ name: 'ddex_acknowledgment_received_at', type: 'timestamptz', nullable: true })
  ddexAcknowledgmentReceivedAt?: Date;

  @ManyToOne(() => Release, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'release_id' })
  release!: Release;

  @ManyToOne(() => Store, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store!: Store;
}
