import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReleasesController } from './releases.controller';
import { ReleaseService } from './releases.service';
import { ReleaseQueryService } from './releases-query.service';
import { Release } from '../../entities/release.entity';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [TypeOrmModule.forFeature([Release]), UploadsModule],
  controllers: [ReleasesController],
  providers: [ReleaseService, ReleaseQueryService],
})
export class ReleasesModule {}
