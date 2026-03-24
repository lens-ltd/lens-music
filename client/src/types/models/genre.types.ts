import { AbstractEntity } from './index.types';

export interface Genre extends AbstractEntity {
  name: string;
  parentId?: string;
  parent?: Genre;
  children?: Genre[];
}
