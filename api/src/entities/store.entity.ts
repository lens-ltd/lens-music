import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ReleaseStore } from './release-store.entity';

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

  @OneToMany(() => ReleaseStore, (releaseStore) => releaseStore.store)
  releaseStores!: ReleaseStore[];
}
