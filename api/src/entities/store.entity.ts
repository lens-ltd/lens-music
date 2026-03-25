import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ReleaseStore } from './release-store.entity';
import { DeliveryProtocol } from '../constants/ddex.constants';

@Entity('stores')
@Unique(['name'])
@Unique(['slug'])
export class Store extends AbstractEntity {
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ name: 'slug', type: 'varchar', length: 255, nullable: false })
  slug!: string;

  @Column({ name: 'is_active', type: 'boolean', nullable: false, default: true })
  isActive!: boolean;

  @Column({ name: 'sort_order', type: 'integer', nullable: false, default: 0 })
  sortOrder!: number;

  // DDEX Party ID (DPID)
  @Column({ name: 'ddex_party_id', type: 'varchar', length: 50, nullable: true })
  ddexPartyId?: string;

  // DELIVERY PROTOCOL
  @Column({
    name: 'delivery_protocol',
    type: 'enum',
    enum: DeliveryProtocol,
    nullable: true,
  })
  deliveryProtocol?: DeliveryProtocol;

  // DELIVERY ENDPOINT
  @Column({ name: 'delivery_endpoint', type: 'varchar', length: 1024, nullable: true })
  deliveryEndpoint?: string;

  @OneToMany(() => ReleaseStore, (releaseStore) => releaseStore.store)
  releaseStores!: ReleaseStore[];
}
