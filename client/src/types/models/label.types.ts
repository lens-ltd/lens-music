import { AbstractEntity } from './index.types';
import { User } from './user.types';
import { Release } from './release.types';

export interface Label extends AbstractEntity {
  name: string;
  email?: string;
  description?: string;
  userId: string;
  country: string;
  user: User;
  releases: Release[];
}
