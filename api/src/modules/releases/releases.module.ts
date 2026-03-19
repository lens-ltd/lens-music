import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReleasesController } from './releases.controller';
import { ReleaseService } from './releases.service';
import { ReleaseQueryService } from './releasesQuery.service';
import { Release } from '../../entities/release.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Release])],
  controllers: [ReleasesController],
  providers: [ReleaseService, ReleaseQueryService],
})
export class ReleasesModule {}
