import 'dotenv/config';
import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import logger from '../utils/logger';
import { seedPermissions } from './permission.seeds';

const seeds = [seedPermissions];

const runSeeds = async () => {
  logger.info('Connecting to database...');
  await AppDataSource.initialize();
  logger.info('Database connected.');

  for (const seed of seeds) {
    logger.info(`Running seed: ${seed.name}`);
    await seed(AppDataSource);
  }

  await AppDataSource.destroy();
  logger.info('All seeds completed.');
};

runSeeds().catch((err) => {
  logger.error({ err }, 'Seed runner failed');
  process.exit(1);
});
