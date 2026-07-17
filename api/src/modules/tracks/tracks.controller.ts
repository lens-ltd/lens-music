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
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { Permissions } from "../../common/decorators/permissions.decorator";
import { PERMISSIONS } from "../../constants/permission.constants";
import { CreateTrackDto } from "./dto/create-track.dto";
import { UpdateTrackDto } from "./dto/update-track.dto";
import { RegisterAudioDto } from "./dto/register-audio.dto";
import { TrackService } from "./tracks.service";
import { TrackQueryService } from "./tracks-query.service";
import { UUID } from "../../types/common.types";
import { CatalogAccessService } from "../catalog-access/catalog-access.service";
@Controller("tracks")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TracksController {
  constructor(
    private readonly trackService: TrackService,
    private readonly trackQueryService: TrackQueryService,
    private readonly catalogAccess: CatalogAccessService,
  ) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(PERMISSIONS.CREATE_TRACK)
  async createTrack(
    @Body() dto: CreateTrackDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteRelease(dto.releaseId, user);
    const track = await this.trackService.createTrack(dto, user.id);
    return { message: "Track created successfully", data: track };
  }
  @Patch(":id")
  @Permissions(PERMISSIONS.UPDATE_TRACK)
  async updateTrack(
    @Param("id") id: string,
    @Body() dto: UpdateTrackDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteTrack(id, user);
    const track = await this.trackService.updateTrack(id as UUID, dto);
    return { message: "Track updated successfully", data: track };
  }
  @Post(":id/validate")
  @HttpCode(HttpStatus.OK)
  @Permissions(PERMISSIONS.UPDATE_TRACK)
  async validateTrack(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteTrack(id, user);
    const result = await this.trackService.validateTrack(id as UUID);
    return { message: "Track validation completed", data: result };
  }
  @Get(":id/audio/sign")
  @Permissions(PERMISSIONS.UPDATE_TRACK)
  async getAudioUploadSignature(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteTrack(id, user);
    const signature = await this.trackService.getUploadSignature(id as UUID);
    return { message: "Upload signature generated", data: signature };
  }
  @Post(":id/audio/register")
  @HttpCode(HttpStatus.CREATED)
  @Permissions(PERMISSIONS.UPDATE_TRACK)
  async registerAudio(
    @Param("id") id: string,
    @Body() dto: RegisterAudioDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteTrack(id, user);
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
  @Permissions(PERMISSIONS.UPDATE_TRACK)
  async uploadAudio(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteTrack(id, user);
    const audioFile = await this.trackService.uploadAudio(
      id as UUID,
      file,
      user.id,
    );
    return { message: "Audio file uploaded successfully", data: audioFile };
  }
  @Delete(":id/audio/:audioFileId")
  @HttpCode(HttpStatus.OK)
  @Permissions(PERMISSIONS.UPDATE_TRACK)
  async deleteAudio(
    @Param("id") id: string,
    @Param("audioFileId") audioFileId: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteTrack(id, user);
    await this.trackService.deleteAudio(id as UUID, audioFileId as UUID);
    return { message: "Audio file deleted successfully" };
  }
  @Get(":id")
  @Permissions(PERMISSIONS.READ_TRACK)
  async getTrackById(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanReadTrack(id, user);
    const track = await this.trackQueryService.getTrackById(id);
    return { message: "Track fetched successfully", data: track };
  }
  @Get()
  @Permissions(PERMISSIONS.READ_TRACK)
  async fetchTracks(
    @CurrentUser() user: AuthUser,
    @Query("size") size = "10",
    @Query("page") page = "0",
    @Query("releaseId") releaseId?: string,
  ) {
    if (releaseId) {
      await this.catalogAccess.assertCanReadRelease(releaseId, user);
    }
    const canReadAcrossAccounts =
      (this.catalogAccess.canManageAllReleases(user) ||
        this.catalogAccess.canReviewReleases(user));
    const tracks = await this.trackQueryService.fetchAllTracks({
      size: Number(size),
      page: Number(page),
      releaseId: releaseId as UUID,
      ownerId: canReadAcrossAccounts ? undefined : user.id,
    });
    return { message: "Tracks fetched successfully", data: tracks };
  }
}
