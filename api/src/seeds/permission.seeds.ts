import { DataSource } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { PERMISSIONS } from '../constants/permission.constants';
import logger from '../utils/logger';

export const seedPermissions = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Permission);
  const seedLog = logger.child({ seed: 'permissions' });

  let created = 0;
  let skipped = 0;

  for (const name of Object.values(PERMISSIONS)) {
    const exists = await repo.findOneBy({ name });
    if (exists) {
      seedLog.debug({ permission: name }, 'Skipped (already exists)');
      skipped++;
    } else {
      await repo.save(repo.create({ name }));
      seedLog.info({ permission: name }, 'Added');
      created++;
    }
  }

  seedLog.info({ created, skipped }, 'Permissions seed complete');
};
