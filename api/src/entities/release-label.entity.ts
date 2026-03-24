import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UUID } from '../types/common.types';
import { Release } from './release.entity';
import { Label } from './label.entity';

@Entity('release_labels')
@Unique(['releaseId', 'labelId'])
export class ReleaseLabel extends AbstractEntity {
  @Column({ name: 'release_id', type: 'uuid', nullable: false })
  releaseId!: UUID;

  @Column({ name: 'label_id', type: 'uuid', nullable: false })
  labelId!: UUID;

  @Column({ name: 'is_primary', type: 'boolean', nullable: false, default: false })
  isPrimary!: boolean;

  @ManyToOne(() => Release, (release) => release.labels, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'release_id' })
  release!: Release;

  @ManyToOne(() => Label, (label) => label.releaseLabels, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'label_id' })
  label!: Label;
}
