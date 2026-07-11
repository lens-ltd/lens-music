import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Release } from '../../entities/release.entity';
import { ReleaseStore } from '../../entities/release-store.entity';
import { Track } from '../../entities/track.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Release, Track, ReleaseStore])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
