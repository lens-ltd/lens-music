import { AbstractEntity } from './index.types';

export interface Store extends AbstractEntity {
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
}
