import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UUID } from '../types/common.types';
import { Release } from './release.entity';

@Entity('release_territory_details')
@Unique(['releaseId', 'territory'])
export class ReleaseTerritoryDetail extends AbstractEntity {
  @Column({ name: 'release_id', type: 'uuid', nullable: false })
  releaseId!: UUID;

  @Column({ name: 'territory', type: 'varchar', length: 2, nullable: false })
  territory!: string;

  @Column({ name: 'title', type: 'varchar', length: 500, nullable: true })
  title?: string;

  @Column({
    name: 'display_artist_name',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  displayArtistName?: string;

  @Column({ name: 'label_name', type: 'varchar', length: 255, nullable: true })
  labelName?: string;

  @ManyToOne(() => Release, (release) => release.territoryDetails, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'release_id' })
  release!: Release;
}
