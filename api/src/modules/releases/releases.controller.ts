import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
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
import { CreateReleaseDto } from "./dto/create-release.dto";
import { UpdateReleaseOverviewDto } from "./dto/update-release-overview.dto";
import { UpdateReleaseTerritoriesDto } from "./dto/update-release-territories.dto";
import { ReleaseService } from "./releases.service";
import { ReleaseQueryService } from "./releases-query.service";
import { memoryStorage } from "multer";
import { UpsertReleaseGenreDto } from "./dto/upsert-release-genre.dto";
import { ReleaseGenreType } from "../../constants/release.constants";
import { AddReleaseLabelDto, DeleteReleaseLabelDto } from "./dto/manage-release-label.dto";

@Controller("releases")
@UseGuards(JwtAuthGuard)
export class ReleasesController {
  constructor(
    private readonly releaseService: ReleaseService,
    private readonly releaseQueryService: ReleaseQueryService,
  ) {}

  @Post()
  async createRelease(
    @Body() dto: CreateReleaseDto,
    @CurrentUser() user: AuthUser,
  ) {
    const release = await this.releaseService.createRelease(dto, user.id);
    return { message: "Release created successfully", data: release };
  }

  @Patch(":id/overview")
  async updateReleaseOverview(
    @Param("id") id: string,
    @Body() dto: UpdateReleaseOverviewDto,
    @CurrentUser() user: AuthUser,
  ) {
    const release = await this.releaseService.updateOverview(id, dto, user);
    return { message: "Release overview updated successfully", data: release };
  }


  @Patch(":id/territories")
  async updateReleaseTerritories(
    @Param("id") id: string,
    @Body() dto: UpdateReleaseTerritoriesDto,
    @CurrentUser() user: AuthUser,
  ) {
    const release = await this.releaseService.updateTerritories(id, dto, user);
    return {
      message: "Release territories updated successfully",
      data: release,
    };
  }

  @Post(":id/cover-art")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
    }),
  )
  async uploadReleaseCoverArt(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @CurrentUser() user: AuthUser,
  ) {
    const release = await this.releaseService.uploadCoverArt(id, file, user);
    return {
      message: "Release cover art uploaded successfully",
      data: release,
    };
  }


  @Post(":id/genres")
  async upsertReleaseGenre(
    @Param("id") id: string,
    @Body() dto: UpsertReleaseGenreDto,
    @CurrentUser() user: AuthUser,
  ) {
    const releaseGenre = await this.releaseService.upsertReleaseGenre(id, dto, user);
    return { message: "Release genre saved successfully", data: releaseGenre };
  }

  @Get(":id/genres")
  async getReleaseGenres(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    const releaseGenres = await this.releaseService.getReleaseGenres(id, user);
    return { message: "Release genres fetched successfully", data: releaseGenres };
  }

  @Delete(":id/genres")
  @HttpCode(HttpStatus.OK)
  async deleteReleaseGenre(
    @Param("id") id: string,
    @Query("type") type: ReleaseGenreType,
    @CurrentUser() user: AuthUser,
  ) {
    await this.releaseService.deleteReleaseGenreByType(id, type, user);
    return { message: "Release genre removed successfully" };
  }
  @Post(":id/labels")
  @HttpCode(HttpStatus.CREATED)
  async addReleaseLabel(
    @Param("id") id: string,
    @Body() dto: AddReleaseLabelDto,
    @CurrentUser() user: AuthUser,
  ) {
    const releaseLabel = await this.releaseService.addReleaseLabel(
      id,
      dto.labelId,
      dto.isPrimary,
      user,
    );

    return {
      message: "Release label upserted successfully",
      data: releaseLabel,
    };
  }

  @Get(":id/labels")
  async getReleaseLabels(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    const labels = await this.releaseService.getReleaseLabels(id, user);
    return {
      message: "Release labels fetched successfully",
      data: labels,
    };
  }

  @Delete(":id/labels")
  @HttpCode(HttpStatus.OK)
  async removeReleaseLabel(
    @Param("id") id: string,
    @Body() dto: DeleteReleaseLabelDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.releaseService.removeReleaseLabel(id, dto.labelId, user);
    return { message: "Release label removed successfully" };
  }

  @Post(":id/validate")
  @HttpCode(HttpStatus.OK)
  async validateRelease(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    const result = await this.releaseService.validateRelease(id, user);
    return { message: "Release validation completed", data: result };
  }

  @Get()
  async fetchAllReleases(
    @CurrentUser() user: AuthUser,
    @Query("createdById") createdById?: string,
    @Query("size") size = "10",
    @Query("page") page = "0",
  ) {
    const releases = await this.releaseQueryService.fetchAllReleases({
      createdById: createdById || user.id,
      size: Number(size),
      page: Number(page),
    });
    return { message: "Releases fetched successfully", data: releases };
  }

  @Get(":id")
  async getReleaseById(@Param("id") id: string) {
    const release = await this.releaseQueryService.getReleaseById(id);
    if (!release) {
      throw new NotFoundException("Release not found");
    }
    return { message: "Release fetched successfully", data: release };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRelease(@Param("id") id: string) {
    await this.releaseService.deleteRelease(id);
  }
}
