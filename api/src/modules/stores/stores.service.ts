import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Store } from '../../entities/store.entity';
import { Release } from '../../entities/release.entity';
import { ReleaseStore } from '../../entities/release-store.entity';
import { UUID } from '../../types/common.types';
import { AssignReleaseStoresDto } from './dto/assign-release-stores.dto';
import { ReleaseStatus } from '../../constants/release.constants';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Release)
    private readonly releaseRepository: Repository<Release>,
    @InjectRepository(ReleaseStore)
    private readonly releaseStoreRepository: Repository<ReleaseStore>,
  ) {}

  async fetchStores(): Promise<Store[]> {
    return this.storeRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async assignReleaseStores(
    releaseId: UUID,
    dto: AssignReleaseStoresDto,
    createdById: UUID,
  ): Promise<ReleaseStore[]> {
    const release = await this.releaseRepository.findOne({ where: { id: releaseId } });

    if (!release) {
      throw new NotFoundException('Release not found');
    }

    const storeIds = dto.storeIds || [];
    const stores = storeIds.length
      ? await this.storeRepository.find({ where: { id: In(storeIds) } })
      : [];

    if (stores.length !== storeIds.length) {
      throw new NotFoundException('One or more stores were not found');
    }

    const existingReleaseStores = await this.releaseStoreRepository.find({
      where: { releaseId },
    });

    const existingByStoreId = new Map(existingReleaseStores.map((item) => [item.storeId, item]));

    const toCreate = storeIds
      .filter((storeId) => !existingByStoreId.has(storeId))
      .map((storeId) =>
        this.releaseStoreRepository.create({
          releaseId,
          storeId,
          createdById,
        }),
      );

    const selectedStoreIds = new Set(storeIds);
    const toDeleteIds = existingReleaseStores
      .filter((item) => !selectedStoreIds.has(item.storeId))
      .map((item) => item.id);

    if (toCreate.length > 0) {
      await this.releaseStoreRepository.save(toCreate);
    }

    if (toDeleteIds.length > 0) {
      await this.releaseStoreRepository.delete(toDeleteIds);
    }

    await this.releaseRepository.update(releaseId, { status: ReleaseStatus.DRAFT });

    return this.findReleaseStores(releaseId);
  }

  async findReleaseStores(releaseId: UUID): Promise<ReleaseStore[]> {
    const release = await this.releaseRepository.findOne({ where: { id: releaseId } });

    if (!release) {
      throw new NotFoundException('Release not found');
    }

    return this.releaseStoreRepository.find({
      where: { releaseId },
      relations: ['store', 'createdBy'],
      order: {
        store: {
          sortOrder: 'ASC',
          name: 'ASC',
        },
      },
    });
  }

  async deleteReleaseStore(releaseId: UUID, releaseStoreId: UUID): Promise<void> {
    const releaseStore = await this.releaseStoreRepository.findOne({
      where: { id: releaseStoreId, releaseId },
    });

    if (!releaseStore) {
      throw new NotFoundException('Release store assignment not found');
    }

    await this.releaseStoreRepository.delete(releaseStoreId);
    await this.releaseRepository.update(releaseId, { status: ReleaseStatus.DRAFT });
  }
}
