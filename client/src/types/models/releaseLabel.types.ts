import { AbstractEntity } from './index.types';
import type { Release } from './release.types';
import type { Label } from './label.types';

export enum ReleaseLabelType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
}

export interface ReleaseLabel extends AbstractEntity {
  releaseId: string;
  labelId: string;
  type: ReleaseLabelType;
  ownership?: string;
  release: Release;
  label: Label;
}
