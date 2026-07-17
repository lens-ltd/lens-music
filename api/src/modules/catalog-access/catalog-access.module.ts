import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Label } from '../../entities/label.entity';
import { Lyrics } from '../../entities/lyrics.entity';
import { Release } from '../../entities/release.entity';
import { ReleaseContributor } from '../../entities/release-contributor.entity';
import { ReleaseNavigationFlow } from '../../entities/release-navigation-flow.entity';
import { Track } from '../../entities/track.entity';
import { TrackContributor } from '../../entities/track-contributor.entity';
import { CatalogAccessService } from './catalog-access.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Release,
      Track,
      Lyrics,
      Label,
      ReleaseContributor,
      ReleaseNavigationFlow,
      TrackContributor,
    ]),
  ],
  providers: [CatalogAccessService],
  exports: [CatalogAccessService],
})
export class CatalogAccessModule {}
