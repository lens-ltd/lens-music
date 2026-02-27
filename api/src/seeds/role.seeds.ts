import { DataSource } from 'typeorm';
import { Role } from '../entities/role.entity';
import { RolePermission } from '../entities/rolePermission.entity';
import { Permission } from '../entities/permission.entity';
import { User } from '../entities/user.entity';
import logger from '../utils/logger';

const SUPER_ADMIN_ROLE_NAME = 'SUPER_ADMIN';
const ADMIN_EMAIL = 'info@lens.rw';

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

  let superAdminRole = await roleRepo.findOneBy({ name: SUPER_ADMIN_ROLE_NAME });
  if (!superAdminRole) {
    superAdminRole = await roleRepo.save(
      roleRepo.create({
        name: SUPER_ADMIN_ROLE_NAME,
        description: 'System super administrator role with all permissions',
        createdById: adminUser.id,
      }),
    );
    seedLog.info({ role: SUPER_ADMIN_ROLE_NAME }, 'Added role');
  } else {
    seedLog.debug({ role: SUPER_ADMIN_ROLE_NAME }, 'Role already exists');
  }

  const permissions = await permissionRepo.find();
  let created = 0;
  let skipped = 0;

  for (const permission of permissions) {
    const exists = await rolePermissionRepo.findOneBy({
      roleId: superAdminRole.id,
      permissionId: permission.id,
    });

    if (exists) {
      skipped++;
      continue;
    }

    await rolePermissionRepo.save(
      rolePermissionRepo.create({
        roleId: superAdminRole.id,
        permissionId: permission.id,
        createdById: adminUser.id,
      }),
    );
    created++;
  }

  seedLog.info(
    { role: SUPER_ADMIN_ROLE_NAME, permissionsAssigned: created, permissionsAlreadyAssigned: skipped },
    'Roles seed complete',
  );
};
