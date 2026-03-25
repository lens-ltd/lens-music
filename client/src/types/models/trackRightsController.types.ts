import type { AbstractEntity } from './index.types';

export enum TrackRightType {
  MAKING_AVAILABLE_RIGHT = 'MAKING_AVAILABLE_RIGHT',
  MECHANICAL_RIGHT = 'MECHANICAL_RIGHT',
  PERFORMANCE_RIGHT = 'PERFORMANCE_RIGHT',
  SYNCHRONIZATION_RIGHT = 'SYNCHRONIZATION_RIGHT',
  REPRODUCTION_RIGHT = 'REPRODUCTION_RIGHT',
}

export interface TrackRightsController extends AbstractEntity {
  trackId: string;
  contributorId?: string;
  labelId?: string;
  controllerName: string;
  rightType: TrackRightType;
  territories: string[];
  rightSharePercentage?: string;
  delegatedUsageRights?: Record<string, unknown>;
}

export interface CreateTrackRightsControllerPayload {
  contributorId?: string;
  labelId?: string;
  controllerName: string;
  rightType: TrackRightType;
  territories: string[];
  rightSharePercentage?: string;
  delegatedUsageRights?: Record<string, unknown>;
}

export type UpdateTrackRightsControllerPayload =
  Partial<CreateTrackRightsControllerPayload>;
