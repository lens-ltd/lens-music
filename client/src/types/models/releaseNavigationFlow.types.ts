import { AbstractEntity } from './index.types';
import type { StaticReleaseNavigation } from './staticReleaseNavigation.types';

export interface ReleaseNavigationFlow extends AbstractEntity {
  releaseId: string;
  staticReleaseNavigationId: string;
  active: boolean;
  completed: boolean;
  staticReleaseNavigation?: StaticReleaseNavigation;
}

export interface ReleaseNavigationFlowCreateResponse {
  flows: ReleaseNavigationFlow[];
  steps: Record<string, StaticReleaseNavigation[]>;
}
