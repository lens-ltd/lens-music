import { Label } from './label.types';
import { Artist } from './artist.types';
import { Release } from './release.types';
import { ROLES } from '../../constants/role.constants';
import type { Person } from './person.types';

export interface User extends Person {
  email: string;
  password: string;
  role: keyof typeof ROLES;
  labels: Label[];
  artists: Artist[];
  releases: Release[];
}
