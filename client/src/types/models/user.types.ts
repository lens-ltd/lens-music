import { Label } from './label.types';
import { Artist } from './artist.types';
import { Release } from './release.types';
import { ROLES } from '../../constants/role.constants';
import type { Person } from './person.types';
import { UserStatus } from './contributor.types';

export interface User extends Person {
  password: string;
  role: keyof typeof ROLES;
  labels: Label[];
  artists: Artist[];
  releases: Release[];
  status: UserStatus;
}
