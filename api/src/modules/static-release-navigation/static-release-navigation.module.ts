import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticReleaseNavigation } from '../../entities/static-release-navigation.entity';
import { StaticReleaseNavigationController } from './static-release-navigation.controller';
import { StaticReleaseNavigationService } from './static-release-navigation.service';

@Module({
  imports: [TypeOrmModule.forFeature([StaticReleaseNavigation])],
  controllers: [StaticReleaseNavigationController],
  providers: [StaticReleaseNavigationService],
  exports: [StaticReleaseNavigationService],
})
export class StaticReleaseNavigationModule {}
