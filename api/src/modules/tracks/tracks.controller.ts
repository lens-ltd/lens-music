import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  CurrentUser,
  AuthUser,
} from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CreateTrackDto } from "./dto/create-track.dto";
import { TrackService } from "./tracks.service";
import { TrackQueryService } from "./tracks-query.service";
import { UUID } from "../../types/common.types";

@Controller("tracks")
@UseGuards(JwtAuthGuard)
export class TracksController {
  constructor(
    private readonly trackService: TrackService,
    private readonly trackQueryService: TrackQueryService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTrack(
    @Body() dto: CreateTrackDto,
    @CurrentUser() user: AuthUser,
  ) {
    const track = await this.trackService.createTrack(dto, user.id);
    return { message: "Track created successfully", data: track };
  }

  @Get(":id")
  async getTrackById(@Param("id") id: string) {
    const track = await this.trackQueryService.getTrackById(id);
    return { message: "Track fetched successfully", data: track };
  }

  @Get()
  async fetchTracks(
    @Query("size") size = "10",
    @Query("page") page = "0",
    @Query("releaseId") releaseId?: string,
  ) {
    const tracks = await this.trackQueryService.fetchAllTracks({
      size: Number(size),
      page: Number(page),
      releaseId: releaseId as UUID,
    });
    return { message: "Tracks fetched successfully", data: tracks };
  }
}
