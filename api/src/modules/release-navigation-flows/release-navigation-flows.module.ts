import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReleaseNavigationFlow } from '../../entities/releaseNavigationFlow.entity';
import { Release } from '../../entities/release.entity';
import { StaticReleaseNavigation } from '../../entities/staticReleaseNavigation.entity';
import { StaticReleaseNavigationModule } from '../static-release-navigation/static-release-navigation.module';
import { ReleaseNavigationFlowsController } from './release-navigation-flows.controller';
import { ReleaseNavigationFlowsService } from './release-navigation-flows.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReleaseNavigationFlow, Release, StaticReleaseNavigation]),
    StaticReleaseNavigationModule,
  ],
  controllers: [ReleaseNavigationFlowsController],
  providers: [ReleaseNavigationFlowsService],
})
export class ReleaseNavigationFlowsModule {}
