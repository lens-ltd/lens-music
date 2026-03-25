import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReleasesController } from './releases.controller';
import { ReleaseService } from './releases.service';
import { ReleaseQueryService } from './releases-query.service';
import { Release } from '../../entities/release.entity';
import { ReleaseContributor } from '../../entities/release-contributor.entity';
import { ReleaseGenre } from '../../entities/release-genre.entity';
import { ReleaseLabel } from '../../entities/release-label.entity';
import { Genre } from '../../entities/genre.entity';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [TypeOrmModule.forFeature([Release, ReleaseContributor, ReleaseGenre, ReleaseLabel, Genre]), UploadsModule],
  controllers: [ReleasesController],
  providers: [ReleaseService, ReleaseQueryService],
})
export class ReleasesModule {}
