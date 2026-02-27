import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import logger from '../utils/logger';
import { hashPassword } from '../helpers/encryptions.helper';
import { UserStatus } from '../constants/user.constants';

const ADMIN_EMAIL = 'info@lens.rw';
const ADMIN_PASSWORD = 'Test@123';
const ADMIN_NAME = 'Lens Super Admin';

export const seedUsers = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(User);
  const seedLog = logger.child({ seed: 'users' });

  const existingAdmin = await repo.findOne({ where: { email: ADMIN_EMAIL } });
  if (existingAdmin) {
    seedLog.debug({ email: ADMIN_EMAIL }, 'Skipped admin user (already exists)');
    return existingAdmin;
  }

  const hashedPassword = await hashPassword(ADMIN_PASSWORD);
  const adminUser = repo.create({
    email: ADMIN_EMAIL,
    password: hashedPassword,
    name: ADMIN_NAME,
    status: UserStatus.ACTIVE,
  });

  const createdAdmin = await repo.save(adminUser);
  seedLog.info({ email: ADMIN_EMAIL, id: createdAdmin.id }, 'Admin user added');
  return createdAdmin;
};
