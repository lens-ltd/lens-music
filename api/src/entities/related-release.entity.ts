import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UUID } from '../types/common.types';
import { Release } from './release.entity';
import { RelatedReleaseRelationType } from '../constants/related-release.constants';

@Entity('related_releases')
export class RelatedRelease extends AbstractEntity {
  @Column({ name: 'release_id', type: 'uuid', nullable: false })
  releaseId!: UUID;

  @Column({ name: 'related_release_id', type: 'uuid', nullable: true })
  relatedReleaseId?: UUID;

  @Column({
    name: 'relation_type',
    type: 'enum',
    enum: RelatedReleaseRelationType,
    nullable: false,
  })
  relationType!: RelatedReleaseRelationType;

  @Column({ name: 'external_id', type: 'varchar', length: 255, nullable: true })
  externalId?: string;

  @ManyToOne(() => Release, (release) => release.outgoingRelatedReleases, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'release_id' })
  release!: Release;

  @ManyToOne(() => Release, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'related_release_id' })
  relatedRelease?: Release;
}
