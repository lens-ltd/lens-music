import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackService } from './tracks.service';

@Controller('tracks')
@UseGuards(JwtAuthGuard)
export class TracksController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTrack(@Body() dto: CreateTrackDto, @CurrentUser() user: AuthUser) {
    const track = await this.trackService.createTrack(dto, user.id);
    return { message: 'Track created successfully', data: track };
  }
}
