import { Label } from './label.types';
import { Release } from './release.types';
import { ROLES } from '../../constants/role.constants';
import type { Person } from './person.types';
import { UserStatus } from './contributor.types';

export interface User extends Person {
  password?: string;
  /** From API after login / invitation complete (role.permissions). */
  permissions?: string[];
  roleName?: string;
  role: keyof typeof ROLES;
  labels: Label[];
  releases: Release[];
  status: UserStatus;
  avatarUrl?: string;
}
