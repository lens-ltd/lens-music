import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistService } from '../../services/artist.service';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistService],
})
export class ArtistsModule {}
