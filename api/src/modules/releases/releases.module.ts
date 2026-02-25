import { Module } from '@nestjs/common';
import { ReleasesController } from './releases.controller';
import { ReleaseService } from '../../services/release.service';

@Module({
  controllers: [ReleasesController],
  providers: [ReleaseService],
})
export class ReleasesModule {}
