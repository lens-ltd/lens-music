import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelatedRelease } from '../../entities/related-release.entity';
import { Release } from '../../entities/release.entity';
import { RelatedReleasesController } from './related-releases.controller';
import { RelatedReleasesService } from './related-releases.service';

@Module({
  imports: [TypeOrmModule.forFeature([RelatedRelease, Release])],
  controllers: [RelatedReleasesController],
  providers: [RelatedReleasesService],
})
export class RelatedReleasesModule {}
