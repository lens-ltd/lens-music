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
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { Permissions } from "../../common/decorators/permissions.decorator";
import { PERMISSIONS } from "../../constants/permission.constants";
import { CreateReleaseDto } from "./dto/create-release.dto";
import { UpdateReleaseOverviewDto } from "./dto/update-release-overview.dto";
import { UpdateReleaseTerritoriesDto } from "./dto/update-release-territories.dto";
import { RejectReleaseDto } from "./dto/reject-release.dto";
import { ReleaseStatus } from "../../constants/release.constants";
import { ReleaseService } from "./releases.service";
import { ReleaseQueryService } from "./releases-query.service";
import { memoryStorage } from "multer";
import { UpsertReleaseGenreDto } from "./dto/upsert-release-genre.dto";
import { ReleaseGenreType } from "../../constants/release.constants";
import { CatalogAccessService } from "../catalog-access/catalog-access.service";
@Controller("releases")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReleasesController {
  constructor(
    private readonly releaseService: ReleaseService,
    private readonly releaseQueryService: ReleaseQueryService,
    private readonly catalogAccess: CatalogAccessService,
  ) {}
  @Post()
  @Permissions(PERMISSIONS.CREATE_RELEASE)
  async createRelease(
    @Body() dto: CreateReleaseDto,
    @CurrentUser() user: AuthUser,
  ) {
    const release = await this.releaseService.createRelease(dto, user.id);
    return { message: "Release created successfully", data: release };
  }
  @Patch(":id/overview")
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async updateReleaseOverview(
    @Param("id") id: string,
    @Body() dto: UpdateReleaseOverviewDto,
    @CurrentUser() user: AuthUser,
  ) {
    const release = await this.releaseService.updateOverview(id, dto, user);
    return { message: "Release overview updated successfully", data: release };
  }
  @Patch(":id/territories")
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
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
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
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
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async upsertReleaseGenre(
    @Param("id") id: string,
    @Body() dto: UpsertReleaseGenreDto,
    @CurrentUser() user: AuthUser,
  ) {
    const releaseGenre = await this.releaseService.upsertReleaseGenre(id, dto, user);
    return { message: "Release genre saved successfully", data: releaseGenre };
  }
  @Get(":id/genres")
  @Permissions(PERMISSIONS.READ_RELEASE)
  async getReleaseGenres(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    const releaseGenres = await this.releaseService.getReleaseGenres(id, user);
    return { message: "Release genres fetched successfully", data: releaseGenres };
  }
  @Delete(":id/genres")
  @HttpCode(HttpStatus.OK)
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async deleteReleaseGenre(
    @Param("id") id: string,
    @Query("type") type: ReleaseGenreType,
    @CurrentUser() user: AuthUser,
  ) {
    await this.releaseService.deleteReleaseGenreByType(id, type, user);
    return { message: "Release genre removed successfully" };
  }
  @Post(":id/validate")
  @HttpCode(HttpStatus.OK)
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async validateRelease(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    const result = await this.releaseService.validateRelease(id, user);
    return { message: "Release validation completed", data: result };
  }
  @Post(":id/submit")
  @HttpCode(HttpStatus.OK)
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async submitRelease(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    const result = await this.releaseService.submitRelease(id, user);
    return { message: "Release submission completed", data: result };
  }
  @Get("review/queue")
  @Permissions(PERMISSIONS.REVIEW_RELEASE)
  async fetchReviewQueue(
    @Query("status") status?: ReleaseStatus,
    @Query("size") size = "10",
    @Query("page") page = "0",
  ) {
    const releases = await this.releaseQueryService.fetchReviewQueue({
      status,
      size: Number(size),
      page: Number(page),
    });
    return { message: "Review queue fetched successfully", data: releases };
  }
  @Post(":id/approve")
  @HttpCode(HttpStatus.OK)
  @Permissions(PERMISSIONS.APPROVE_RELEASE)
  async approveRelease(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    const release = await this.releaseService.approveRelease(id, user);
    return { message: "Release approved successfully", data: release };
  }
  @Post(":id/reject")
  @HttpCode(HttpStatus.OK)
  @Permissions(PERMISSIONS.REJECT_RELEASE)
  async rejectRelease(
    @Param("id") id: string,
    @Body() dto: RejectReleaseDto,
    @CurrentUser() user: AuthUser,
  ) {
    const release = await this.releaseService.rejectRelease(id, dto, user);
    return { message: "Release rejected successfully", data: release };
  }
  @Get()
  @Permissions(PERMISSIONS.READ_RELEASE)
  async fetchAllReleases(
    @CurrentUser() user: AuthUser,
    @Query("createdById") createdById?: string,
    @Query("size") size = "10",
    @Query("page") page = "0",
  ) {
    const canReadAcrossAccounts =
      this.catalogAccess.canManageAllReleases(user) ||
      this.catalogAccess.canReviewReleases(user);
    const releases = await this.releaseQueryService.fetchAllReleases({
      createdById: canReadAcrossAccounts ? createdById : user.id,
      size: Number(size),
      page: Number(page),
    });
    return { message: "Releases fetched successfully", data: releases };
  }
  @Get(":id")
  @Permissions(PERMISSIONS.READ_RELEASE)
  async getReleaseById(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanReadRelease(id, user);
    const release = await this.releaseQueryService.getReleaseById(id);
    if (!release) {
      throw new NotFoundException("Release not found");
    }
    return { message: "Release fetched successfully", data: release };
  }
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(PERMISSIONS.DELETE_RELEASE)
  async deleteRelease(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.releaseService.deleteRelease(id, user);
  }
}
