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
  UseGuards,
} from "@nestjs/common";
import {
  CurrentUser,
  AuthUser,
} from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { Permissions } from "../../common/decorators/permissions.decorator";
import { PERMISSIONS } from "../../constants/permission.constants";
import { TrackContributorsService } from "./track-contributors.service";
import { CreateTrackContributorDto } from "./dto/create-track-contributor.dto";
import { UpdateTrackContributorDto } from "./dto/update-track-contributor.dto";
import { UUID } from "../../types/common.types";
import { CatalogAccessService } from "../catalog-access/catalog-access.service";

@Controller("track-contributors")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TrackContributorsController {
  constructor(
    private readonly trackContributorsService: TrackContributorsService,
    private readonly catalogAccess: CatalogAccessService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(PERMISSIONS.UPDATE_TRACK)
  async create(
    @Body() dto: CreateTrackContributorDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteTrack(dto.trackId, user);
    const trackContributor = await this.trackContributorsService.create(
      dto,
      user.id,
    );
    return {
      message: "Track contributor added successfully",
      data: trackContributor,
    };
  }

  @Patch(":id")
  @Permissions(PERMISSIONS.UPDATE_TRACK)
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateTrackContributorDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteTrackContributor(id, user);
    const trackContributor = await this.trackContributorsService.update(
      id as UUID,
      dto,
    );
    return {
      message: "Track contributor updated successfully",
      data: trackContributor,
    };
  }

  @Get()
  @Permissions(PERMISSIONS.READ_TRACK)
  async findByTrackId(
    @Query("trackId") trackId: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanReadTrack(trackId, user);
    const trackContributors =
      await this.trackContributorsService.findByTrackId(trackId as UUID);
    return {
      message: "Track contributors fetched successfully",
      data: trackContributors,
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @Permissions(PERMISSIONS.UPDATE_TRACK)
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteTrackContributor(id, user);
    await this.trackContributorsService.delete(id as UUID);
    return { message: "Track contributor removed successfully" };
  }
}
