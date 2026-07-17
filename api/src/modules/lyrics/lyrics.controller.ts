import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { LyricsService } from "./lyrics.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { Permissions } from "../../common/decorators/permissions.decorator";
import { PERMISSIONS } from "../../constants/permission.constants";
import { Lyrics } from "../../entities/lyrics.entity";
import {
  AuthUser,
  CurrentUser,
} from "../../common/decorators/current-user.decorator";
import { UUID } from "../../types/common.types";
import { CatalogAccessService } from "../catalog-access/catalog-access.service";
@Controller("lyrics")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LyricsController {
  constructor(
    private readonly lyricsService: LyricsService,
    private readonly catalogAccess: CatalogAccessService,
  ) {}
  @Post()
  @Permissions(PERMISSIONS.CREATE_LYRICS)
  async createLyrics(
    @Body() body: Partial<Lyrics>,
    @CurrentUser() user: AuthUser,
  ) {
    if (!body.trackId) {
      throw new BadRequestException('trackId is required');
    }
    await this.catalogAccess.assertCanWriteTrack(body.trackId, user);
    const lyrics = await this.lyricsService.createLyrics({
      ...body,
      createdById: user?.id,
    });
    return { message: "Lyrics created successfully", data: lyrics };
  }
  @Get()
  @Permissions(PERMISSIONS.READ_LYRICS)
  async fetchLyrics(
    @CurrentUser() user: AuthUser,
    @Query("size") size = "10",
    @Query("page") page = "0",
    @Query("trackId") trackId?: UUID,
  ) {
    if (trackId) {
      await this.catalogAccess.assertCanReadTrack(trackId, user);
    }
    const canReadAcrossAccounts =
      this.catalogAccess.canManageAllReleases(user) ||
      this.catalogAccess.canReviewReleases(user);
    const condition = {
      ...(trackId ? { trackId } : {}),
      ...(!canReadAcrossAccounts
        ? { track: { release: { createdById: user.id } } }
        : {}),
    };
    const lyrics = await this.lyricsService.fetchLyrics(
      condition,
      Number(size),
      Number(page),
    );
    return { message: "Lyrics fetched successfully", data: lyrics };
  }
  @Get(":id")
  @Permissions(PERMISSIONS.READ_LYRICS)
  async getLyricsById(
    @Param("id") id: UUID,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanReadLyrics(id, user);
    const lyrics = await this.lyricsService.getLyricsById(id);
    return { message: "Lyrics fetched successfully", data: lyrics };
  }
  @Patch(":id")
  @Permissions(PERMISSIONS.UPDATE_LYRICS)
  async updateLyrics(
    @Param("id") id: UUID,
    @Body() body: Partial<Lyrics>,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteLyrics(id, user);
    const lyrics = await this.lyricsService.updateLyrics(id, body);
    return { message: "Lyrics updated successfully", data: lyrics };
  }
  @Delete(":id")
  @Permissions(PERMISSIONS.DELETE_LYRICS)
  async deleteLyrics(
    @Param("id") id: UUID,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteLyrics(id, user);
    await this.lyricsService.deleteLyrics(id);
    return { message: "Lyrics deleted successfully" };
  }
}
