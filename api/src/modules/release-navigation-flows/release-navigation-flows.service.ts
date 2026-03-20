import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ReleaseNavigationFlow } from '../../entities/release-navigation-flow.entity';
import { Release } from '../../entities/release.entity';
import { StaticReleaseNavigation } from '../../entities/static-release-navigation.entity';
import { UUID } from '../../types/common.types';
import {
  GroupedStaticReleaseNavigation,
  StaticReleaseNavigationService,
} from '../static-release-navigation/static-release-navigation.service';

export interface ReleaseNavigationFlowCreateResponse {
  flows: ReleaseNavigationFlow[];
  steps: GroupedStaticReleaseNavigation;
}

@Injectable()
export class ReleaseNavigationFlowsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ReleaseNavigationFlow)
    private readonly releaseNavigationFlowRepository: Repository<ReleaseNavigationFlow>,
    @InjectRepository(Release)
    private readonly releaseRepository: Repository<Release>,
    @InjectRepository(StaticReleaseNavigation)
    private readonly staticReleaseNavigationRepository: Repository<StaticReleaseNavigation>,
    private readonly staticReleaseNavigationService: StaticReleaseNavigationService,
  ) {}

  async fetchAllReleaseNavigationFlows(releaseId: UUID): Promise<ReleaseNavigationFlow[]> {
    await this.ensureReleaseExists(releaseId);
    return this.loadReleaseFlows(releaseId);
  }

  async createOrActivateNavigationFlow({
    releaseId,
    staticReleaseNavigationId,
  }: {
    releaseId: UUID;
    staticReleaseNavigationId: UUID;
  }): Promise<ReleaseNavigationFlowCreateResponse> {
    await this.ensureReleaseExists(releaseId);

    const staticReleaseNavigation = await this.staticReleaseNavigationRepository.findOne({
      where: { id: staticReleaseNavigationId },
    });

    if (!staticReleaseNavigation) {
      throw new NotFoundException('Static release navigation step not found');
    }

    await this.dataSource.transaction(async (manager) => {
      const releaseNavigationFlowRepo = manager.getRepository(ReleaseNavigationFlow);

      const currentFlows = await releaseNavigationFlowRepo.find({
        where: { releaseId },
      });

      if (currentFlows.length) {
        currentFlows.forEach((flow) => {
          flow.active = false;
        });
        await releaseNavigationFlowRepo.save(currentFlows);
      }

      let flow = await releaseNavigationFlowRepo.findOne({
        where: { releaseId, staticReleaseNavigationId },
      });

      if (!flow) {
        flow = releaseNavigationFlowRepo.create({
          releaseId,
          staticReleaseNavigationId,
          active: true,
        });
      }

      flow.active = true;
      await releaseNavigationFlowRepo.save(flow);
    });

    const [flows, steps] = await Promise.all([
      this.loadReleaseFlows(releaseId),
      this.staticReleaseNavigationService.fetchAllSteps(),
    ]);

    return { flows, steps };
  }

  async completeNavigationFlow({
    id,
    isCompleted,
  }: {
    id: UUID;
    isCompleted: boolean;
  }): Promise<ReleaseNavigationFlow> {
    const flow = await this.releaseNavigationFlowRepository.findOne({
      where: { id },
      relations: ['staticReleaseNavigation'],
    });

    if (!flow) {
      throw new NotFoundException('Release navigation flow not found');
    }

    flow.completed = isCompleted;
    await this.releaseNavigationFlowRepository.save(flow);

    return this.releaseNavigationFlowRepository.findOneOrFail({
      where: { id: flow.id },
      relations: ['staticReleaseNavigation'],
    });
  }

  private async ensureReleaseExists(releaseId: UUID): Promise<void> {
    const release = await this.releaseRepository.findOne({ where: { id: releaseId } });
    if (!release) {
      throw new NotFoundException('Release not found');
    }
  }

  private async loadReleaseFlows(releaseId: UUID): Promise<ReleaseNavigationFlow[]> {
    return this.releaseNavigationFlowRepository
      .createQueryBuilder('releaseNavigationFlow')
      .leftJoinAndSelect(
        'releaseNavigationFlow.staticReleaseNavigation',
        'staticReleaseNavigation',
      )
      .where('releaseNavigationFlow.releaseId = :releaseId', { releaseId })
      .orderBy('staticReleaseNavigation.tabOrder', 'ASC')
      .addOrderBy('staticReleaseNavigation.stepOrder', 'ASC')
      .getMany();
  }
}
