import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from '../../entities/track.entity';
import { AudioFile } from '../../entities/audio-file.entity';
import { TrackContributor } from '../../entities/track-contributor.entity';
import { TracksController } from './tracks.controller';
import { TrackService } from './tracks.service';
import { TrackQueryService } from './tracks-query.service';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track, AudioFile, TrackContributor]),
    UploadsModule,
  ],
  controllers: [TracksController],
  providers: [TrackService, TrackQueryService],
})
export class TracksModule {}
