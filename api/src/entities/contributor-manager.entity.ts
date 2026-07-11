import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Contributor } from './contributor.entity';
import { User } from './user.entity';
import { UUID } from '../types/common.types';

/**
 * Per-contributor manager assignment.
 * Admin (ASSIGN_CONTRIBUTOR_MANAGER) assigns users who may manage this contributor
 * when they also hold the relevant contributor permission.
 */
@Entity('contributor_managers')
@Unique(['contributorId', 'userId'])
export class ContributorManager extends AbstractEntity {
  @Column({ name: 'contributor_id', type: 'uuid', nullable: false })
  contributorId!: UUID;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId!: UUID;

  @ManyToOne(() => Contributor, (contributor) => contributor.managers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'contributor_id' })
  contributor!: Contributor;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
