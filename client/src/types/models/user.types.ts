import { Label } from './label.types';
import { Artist } from './artist.types';
import { Release } from './release.types';
import { ROLES } from '../../constants/role.constants';
import { AbstractEntity } from './index.types';

export interface User extends AbstractEntity {
  email: string;
  name: string;
  phone?: string;
  password: string;
  role: keyof typeof ROLES;
  labels: Label[];
  artists: Artist[];
  releases: Release[];
}
