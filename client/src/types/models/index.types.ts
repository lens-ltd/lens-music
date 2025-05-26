import { UUID } from '../common.types';

export type AbstractEntity = {
  id: UUID;
  createdAt: Date;
  updatedAt: Date;
};
