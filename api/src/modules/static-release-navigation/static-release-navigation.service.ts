import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaticReleaseNavigation } from '../../entities/static-release-navigation.entity';

export type GroupedStaticReleaseNavigation = Record<string, StaticReleaseNavigation[]>;

@Injectable()
export class StaticReleaseNavigationService {
  constructor(
    @InjectRepository(StaticReleaseNavigation)
    private readonly staticReleaseNavigationRepository: Repository<StaticReleaseNavigation>,
  ) {}

  async fetchAllSteps(): Promise<GroupedStaticReleaseNavigation> {
    const steps = await this.staticReleaseNavigationRepository.find({
      order: {
        tabOrder: 'ASC',
        stepOrder: 'ASC',
      },
    });

    return steps.reduce<GroupedStaticReleaseNavigation>((grouped, step) => {
      if (!grouped[step.tabName]) {
        grouped[step.tabName] = [];
      }

      grouped[step.tabName].push(step);
      return grouped;
    }, {});
  }
}
