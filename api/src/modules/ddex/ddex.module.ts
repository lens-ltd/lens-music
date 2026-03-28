import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DdexErnGeneratorService } from './ddex-ern-generator.service';
import { DdexErnGeneratorController } from './ddex-ern-generator.controller';

import { Release } from '../../entities/release.entity';
import { Track } from '../../entities/track.entity';
import { ReleaseContributor } from '../../entities/release-contributor.entity';
import { TrackContributor } from '../../entities/track-contributor.entity';
import { ReleaseLabel } from '../../entities/release-label.entity';
import { Deal } from '../../entities/deal.entity';
import { Store } from '../../entities/store.entity';
import { ReleaseStore } from '../../entities/release-store.entity';
import { TrackRightsController } from '../../entities/track-rights-controller.entity';
import { ReleaseGenre } from '../../entities/release-genre.entity';
import { ReleaseTerritoryDetail } from '../../entities/release-territory-detail.entity';
import { RelatedRelease } from '../../entities/related-release.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Release,
      Track,
      ReleaseContributor,
      TrackContributor,
      ReleaseLabel,
      Deal,
      Store,
      ReleaseStore,
      TrackRightsController,
      ReleaseGenre,
      ReleaseTerritoryDetail,
      RelatedRelease,
    ]),
  ],
  controllers: [DdexErnGeneratorController],
  providers: [DdexErnGeneratorService],
  exports: [DdexErnGeneratorService],
})
export class DdexModule {}
