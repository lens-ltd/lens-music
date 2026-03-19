import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ReleaseNavigationFlow } from './releaseNavigationFlow.entity';

@Entity('static_release_navigation')
export class StaticReleaseNavigation extends AbstractEntity {
  @Column({ name: 'step_name', nullable: false, type: 'varchar' })
  stepName!: string;

  @Column({ name: 'step_description', nullable: true, type: 'varchar' })
  stepDescription!: string;

  @Column({ name: 'step_order', nullable: false, type: 'integer' })
  stepOrder!: number;

  @Column({ name: 'tab_name', nullable: false, type: 'varchar' })
  tabName!: string;

  @Column({ name: 'tab_description', nullable: true, type: 'varchar' })
  tabDescription!: string;

  @Column({ name: 'tab_order', nullable: false, type: 'integer' })
  tabOrder!: number;

  /**
   * RELATIONS
   */

  // RELEASE NAVIGATION FLOWS
  @OneToMany(
    () => ReleaseNavigationFlow,
    (releaseNavigationFlow) => releaseNavigationFlow.staticReleaseNavigation,
  )
  releaseNavigationFlows!: ReleaseNavigationFlow[];
}
