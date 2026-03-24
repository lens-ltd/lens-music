import { AbstractEntity } from './index.types';
import { Label } from './label.types';

export interface ReleaseLabel extends AbstractEntity {
  releaseId: string;
  labelId: string;
  isPrimary: boolean;
  label?: Label;
}
