import {
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
@Controller("lyrics")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LyricsController {
  constructor(private readonly lyricsService: LyricsService) {}
  @Post()
  @Permissions(PERMISSIONS.CREATE_LYRICS)
  async createLyrics(
    @Body() body: Partial<Lyrics>,
    @CurrentUser() user: AuthUser,
  ) {
    const lyrics = await this.lyricsService.createLyrics({
      ...body,
      createdById: user?.id,
    });
    return { message: "Lyrics created successfully", data: lyrics };
  }
  @Get()
  @Permissions(PERMISSIONS.READ_LYRICS)
  async fetchLyrics(
    @Query("size") size = "10",
    @Query("page") page = "0",
    @Query("trackId") trackId?: UUID,
  ) {
    const condition = trackId ? { trackId } : {};
    const lyrics = await this.lyricsService.fetchLyrics(
      condition,
      Number(size),
      Number(page),
    );
    return { message: "Lyrics fetched successfully", data: lyrics };
  }
  @Get(":id")
  @Permissions(PERMISSIONS.READ_LYRICS)
  async getLyricsById(@Param("id") id: UUID) {
    const lyrics = await this.lyricsService.getLyricsById(id);
    return { message: "Lyrics fetched successfully", data: lyrics };
  }
  @Patch(":id")
  @Permissions(PERMISSIONS.UPDATE_LYRICS)
  async updateLyrics(@Param("id") id: UUID, @Body() body: Partial<Lyrics>) {
    const lyrics = await this.lyricsService.updateLyrics(id, body);
    return { message: "Lyrics updated successfully", data: lyrics };
  }
  @Delete(":id")
  @Permissions(PERMISSIONS.DELETE_LYRICS)
  async deleteLyrics(@Param("id") id: UUID) {
    await this.lyricsService.deleteLyrics(id);
    return { message: "Lyrics deleted successfully" };
  }
}
