import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { UUID } from '../types/common.types';
import { AbstractEntity } from './abstract.entity';
import { StaticReleaseNavigation } from './staticReleaseNavigation.entity';
import { Release } from './release.entity';


@Entity('release_navigation_flows')
@Unique(['releaseId', 'staticReleaseNavigationId'])
export class ReleaseNavigationFlow extends AbstractEntity {
  // RELEASE ID
  @Column({ name: 'release_id', nullable: false, type: 'uuid' })
  releaseId!: UUID;

  // STATIC RELEASE NAVIGATION ID
  @Column({ name: 'static_release_navigation_id', nullable: false, type: 'uuid' })
  staticReleaseNavigationId!: UUID;

  // ACTIVE
  @Column({ name: 'active', nullable: false, type: 'boolean', default: true })
  active!: boolean;

  // COMPLETED
  @Column({ name: 'completed', nullable: false, type: 'boolean', default: false })
  completed!: boolean;

  /**
   * RELATIONS
   */

  // RELEASE
  @ManyToOne(() => Release, (release) => release.releaseNavigationFlows, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'release_id' })
  release!: Release;

  // STATIC RELEASE NAVIGATION
  @ManyToOne(
    () => StaticReleaseNavigation,
    (staticReleaseNavigation) => staticReleaseNavigation.releaseNavigationFlows,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'static_release_navigation_id' })
  staticReleaseNavigation!: StaticReleaseNavigation;
}
