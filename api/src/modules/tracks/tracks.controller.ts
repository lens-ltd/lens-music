import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  CurrentUser,
  AuthUser,
} from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CreateTrackDto } from "./dto/create-track.dto";
import { UpdateTrackDto } from "./dto/update-track.dto";
import { RegisterAudioDto } from "./dto/register-audio.dto";
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

  @Patch(":id")
  async updateTrack(@Param("id") id: string, @Body() dto: UpdateTrackDto) {
    const track = await this.trackService.updateTrack(id as UUID, dto);
    return { message: "Track updated successfully", data: track };
  }

  @Post(":id/validate")
  @HttpCode(HttpStatus.OK)
  async validateTrack(@Param("id") id: string) {
    const result = await this.trackService.validateTrack(id as UUID);
    return { message: "Track validation completed", data: result };
  }

  @Get(":id/audio/sign")
  async getAudioUploadSignature(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    const signature = await this.trackService.getUploadSignature(id as UUID);
    return { message: "Upload signature generated", data: signature };
  }

  @Post(":id/audio/register")
  @HttpCode(HttpStatus.CREATED)
  async registerAudio(
    @Param("id") id: string,
    @Body() dto: RegisterAudioDto,
    @CurrentUser() user: AuthUser,
  ) {
    const audioFile = await this.trackService.registerUploadedAudio(
      id as UUID,
      dto,
      user.id,
    );
    return { message: "Audio file registered successfully", data: audioFile };
  }

  @Post(":id/audio")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor("file"))
  async uploadAudio(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthUser,
  ) {
    const audioFile = await this.trackService.uploadAudio(
      id as UUID,
      file,
      user.id,
    );
    return { message: "Audio file uploaded successfully", data: audioFile };
  }

  @Delete(":id/audio/:audioFileId")
  @HttpCode(HttpStatus.OK)
  async deleteAudio(
    @Param("id") id: string,
    @Param("audioFileId") audioFileId: string,
  ) {
    await this.trackService.deleteAudio(id as UUID, audioFileId as UUID);
    return { message: "Audio file deleted successfully" };
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
