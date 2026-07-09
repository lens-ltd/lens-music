import type { AbstractEntity } from './index.types';

export interface Role extends AbstractEntity {
  name: string;
  description?: string;
  permissions?: RolePermission[];
}

export interface RolePermission extends AbstractEntity {
  roleId: string;
  permissionId: string;
  role?: Role;
  permission?: Permission;
}

export interface Permission extends AbstractEntity {
  name: string;
  description?: string;
}