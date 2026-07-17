import { DataSource, In, IsNull } from 'typeorm';
import { Role } from '../entities/role.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { Permission } from '../entities/permission.entity';
import { User } from '../entities/user.entity';
import { PERMISSIONS } from '../constants/permission.constants';
import { UserStatus } from '../constants/user.constants';
import logger from '../utils/logger';

const ADMIN_EMAIL = 'info@lens.rw';

const ROLE_PERMISSION_MAP: Record<string, PERMISSIONS[] | 'ALL'> = {
  SUPER_ADMIN: 'ALL',
  ADMIN: [
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.READ_USER,
    PERMISSIONS.UPDATE_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.UPDATE_OWN_PROFILE,
    PERMISSIONS.CREATE_INVITATION,
    PERMISSIONS.READ_INVITATION,
    PERMISSIONS.APPROVE_INVITATION,
    PERMISSIONS.REVOKE_INVITATION,
    PERMISSIONS.CREATE_ROLE,
    PERMISSIONS.READ_ROLE,
    PERMISSIONS.UPDATE_ROLE,
    PERMISSIONS.READ_RELEASE,
    PERMISSIONS.CREATE_RELEASE,
    PERMISSIONS.UPDATE_RELEASE,
    PERMISSIONS.DELETE_RELEASE,
    PERMISSIONS.REVIEW_RELEASE,
    PERMISSIONS.APPROVE_RELEASE,
    PERMISSIONS.REJECT_RELEASE,
    PERMISSIONS.MANAGE_ALL_RELEASES,
    PERMISSIONS.READ_STORE,
    PERMISSIONS.UPDATE_STORE,
    PERMISSIONS.ASSIGN_RELEASE_STORE,
    PERMISSIONS.READ_GENRE,
    PERMISSIONS.CREATE_GENRE,
    PERMISSIONS.UPDATE_GENRE,
    PERMISSIONS.DELETE_GENRE,
    PERMISSIONS.READ_CONTRIBUTOR,
    PERMISSIONS.CREATE_CONTRIBUTOR,
    PERMISSIONS.UPDATE_CONTRIBUTOR,
    PERMISSIONS.DELETE_CONTRIBUTOR,
    PERMISSIONS.VERIFY_CONTRIBUTOR,
    PERMISSIONS.ASSIGN_CONTRIBUTOR_MANAGER,
    PERMISSIONS.READ_TRACK,
    PERMISSIONS.CREATE_TRACK,
    PERMISSIONS.UPDATE_TRACK,
    PERMISSIONS.DELETE_TRACK,
    PERMISSIONS.READ_LYRICS,
    PERMISSIONS.CREATE_LYRICS,
    PERMISSIONS.UPDATE_LYRICS,
    PERMISSIONS.DELETE_LYRICS,
    PERMISSIONS.SYNC_LYRICS,
    PERMISSIONS.GENERATE_DDEX,
  ],
  REVIEWER: [
    PERMISSIONS.UPDATE_OWN_PROFILE,
    PERMISSIONS.READ_USER,
    PERMISSIONS.READ_INVITATION,
    PERMISSIONS.READ_ROLE,
    PERMISSIONS.READ_RELEASE,
    PERMISSIONS.REVIEW_RELEASE,
    PERMISSIONS.APPROVE_RELEASE,
    PERMISSIONS.REJECT_RELEASE,
    PERMISSIONS.READ_STORE,
    PERMISSIONS.READ_GENRE,
    PERMISSIONS.READ_CONTRIBUTOR,
    PERMISSIONS.VERIFY_CONTRIBUTOR,
    PERMISSIONS.READ_TRACK,
    PERMISSIONS.READ_LYRICS,
    PERMISSIONS.GENERATE_DDEX,
  ],
  GENERAL_USER: [
    PERMISSIONS.UPDATE_OWN_PROFILE,
    PERMISSIONS.CREATE_RELEASE,
    PERMISSIONS.READ_RELEASE,
    PERMISSIONS.UPDATE_RELEASE,
    PERMISSIONS.DELETE_RELEASE,
    PERMISSIONS.READ_STORE,
    PERMISSIONS.ASSIGN_RELEASE_STORE,
    PERMISSIONS.READ_GENRE,
    PERMISSIONS.CREATE_CONTRIBUTOR,
    PERMISSIONS.READ_CONTRIBUTOR,
    PERMISSIONS.UPDATE_CONTRIBUTOR,
    PERMISSIONS.DELETE_CONTRIBUTOR,
    PERMISSIONS.CREATE_TRACK,
    PERMISSIONS.READ_TRACK,
    PERMISSIONS.UPDATE_TRACK,
    PERMISSIONS.DELETE_TRACK,
    PERMISSIONS.CREATE_LYRICS,
    PERMISSIONS.READ_LYRICS,
    PERMISSIONS.UPDATE_LYRICS,
    PERMISSIONS.DELETE_LYRICS,
    PERMISSIONS.SYNC_LYRICS,
  ],
};

const ROLE_DESCRIPTIONS: Record<string, string> = {
  SUPER_ADMIN: 'System super administrator role with all permissions',
  ADMIN: 'Administrator role with catalog, user, invitation, and operational permissions',
  REVIEWER: 'Reviewer role with read-only catalog access and verification permissions',
  GENERAL_USER: 'Catalog creator role for releases, contributors, tracks, lyrics, and profile management',
};

export const seedRoles = async (dataSource: DataSource) => {
  const roleRepo = dataSource.getRepository(Role);
  const rolePermissionRepo = dataSource.getRepository(RolePermission);
  const permissionRepo = dataSource.getRepository(Permission);
  const userRepo = dataSource.getRepository(User);
  const seedLog = logger.child({ seed: 'roles' });

  const adminUser = await userRepo.findOne({ where: { email: ADMIN_EMAIL } });
  if (!adminUser) {
    seedLog.warn({ email: ADMIN_EMAIL }, 'Skipped roles seed (admin user not found)');
    return;
  }

  const permissions = await permissionRepo.find();
  const permissionByName = new Map(permissions.map((permission) => [permission.name, permission]));
  let superAdminRole: Role | null = null;
  let generalUserRole: Role | null = null;

  for (const [roleName, configuredPermissions] of Object.entries(ROLE_PERMISSION_MAP)) {
    let role = await roleRepo.findOneBy({ name: roleName });
    if (!role) {
      role = await roleRepo.save(
        roleRepo.create({
          name: roleName,
          description: ROLE_DESCRIPTIONS[roleName],
          createdById: adminUser.id,
        }),
      );
      seedLog.info({ role: roleName }, 'Added role');
    } else {
      seedLog.debug({ role: roleName }, 'Role already exists');
    }

    if (roleName === 'SUPER_ADMIN') {
      superAdminRole = role;
    }
    if (roleName === 'GENERAL_USER') {
      generalUserRole = role;
    }

    const expectedPermissionNames = configuredPermissions === 'ALL'
      ? permissions.map((permission) => permission.name)
      : configuredPermissions;
    const expectedPermissionIds = expectedPermissionNames
      .map((permissionName) => permissionByName.get(permissionName)?.id)
      .filter((permissionId): permissionId is string => Boolean(permissionId));
    const expectedPermissionIdSet = new Set(expectedPermissionIds);

    const existingRolePermissions = await rolePermissionRepo.find({
      where: { roleId: role.id },
    });
    const existingPermissionIdSet = new Set(
      existingRolePermissions.map((rolePermission) => rolePermission.permissionId),
    );

    let created = 0;
    let skipped = 0;
    for (const permissionId of expectedPermissionIds) {
      if (existingPermissionIdSet.has(permissionId)) {
        skipped++;
        continue;
      }

      await rolePermissionRepo.save(
        rolePermissionRepo.create({
          roleId: role.id,
          permissionId,
          createdById: adminUser.id,
        }),
      );
      created++;
    }

    const staleRolePermissionIds = existingRolePermissions
      .filter((rolePermission) => !expectedPermissionIdSet.has(rolePermission.permissionId))
      .map((rolePermission) => rolePermission.id);

    if (staleRolePermissionIds.length) {
      await rolePermissionRepo.delete({ id: In(staleRolePermissionIds) });
    }

    seedLog.info(
      {
        role: roleName,
        permissionsAssigned: created,
        permissionsAlreadyAssigned: skipped,
        stalePermissionsRemoved: staleRolePermissionIds.length,
      },
      'Role permissions seed complete',
    );
  }

  if (!superAdminRole) {
    seedLog.warn('Skipped assigning admin user role (SUPER_ADMIN role not found)');
    return;
  }

  await userRepo.update({ id: adminUser.id }, { roleId: superAdminRole.id });
  seedLog.info(
    { userId: adminUser.id, role: superAdminRole.name },
    'Assigned role to admin user',
  );

  if (!generalUserRole) {
    seedLog.warn('Skipped backfilling roleless users (GENERAL_USER role not found)');
    return;
  }

  const backfillResult = await userRepo.update(
    { roleId: IsNull(), status: UserStatus.ACTIVE },
    { roleId: generalUserRole.id },
  );
  seedLog.info(
    { usersUpdated: backfillResult.affected ?? 0, role: generalUserRole.name },
    'Assigned GENERAL_USER role to active roleless users',
  );
};
