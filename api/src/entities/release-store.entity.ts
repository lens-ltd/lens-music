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


  @ManyToOne(() => Release, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'release_id' })
  release!: Release;

  @ManyToOne(() => Store, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store!: Store;
}
