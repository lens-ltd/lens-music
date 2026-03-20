import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from '../../entities/track.entity';
import { TracksController } from './tracks.controller';
import { TrackService } from './tracks.service';
import { TrackQueryService } from './tracks-query.service';

@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  controllers: [TracksController],
  providers: [TrackService, TrackQueryService],
})
export class TracksModule {}
