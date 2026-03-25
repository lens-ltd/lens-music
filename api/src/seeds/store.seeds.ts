import { DataSource } from 'typeorm';
import { Store } from '../entities/store.entity';
import { DEFAULT_DSP_STORES } from '../constants/store.constants';
import logger from '../utils/logger';

export const seedStores = async (dataSource: DataSource) => {
  const storeRepo = dataSource.getRepository(Store);
  const seedLog = logger.child({ seed: 'stores' });

  for (const [index, store] of DEFAULT_DSP_STORES.entries()) {
    const existing = await storeRepo.findOne({ where: { slug: store.slug } });

    const ddexPartyId = `PLACEHOLDER_${store.slug.replace(/-/g, '_').toUpperCase()}`;

    if (existing) {
      await storeRepo.update(existing.id, {
        name: store.name,
        sortOrder: index,
        isActive: true,
        ddexPartyId,
      });
      continue;
    }

    await storeRepo.save(
      storeRepo.create({
        ...store,
        sortOrder: index,
        isActive: true,
        ddexPartyId,
      }),
    );
  }

  seedLog.info(
    { count: DEFAULT_DSP_STORES.length },
    'Default DSP stores seed complete',
  );
};
