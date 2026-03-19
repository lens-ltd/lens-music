import { AbstractEntity } from './index.types';
import type { ReleaseNavigationFlow } from './releaseNavigationFlow.types';

export interface StaticReleaseNavigation extends AbstractEntity {
  stepName: string;
  stepDescription: string;
  stepOrder: number;
  tabName: string;
  tabDescription: string;
  tabOrder: number;
  releaseNavigationFlows?: ReleaseNavigationFlow[];
}

export type GroupedStaticReleaseNavigation = Record<string, StaticReleaseNavigation[]>;
