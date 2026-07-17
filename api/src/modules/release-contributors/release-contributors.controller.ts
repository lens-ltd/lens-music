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
import { ReleaseContributorsService } from "./release-contributors.service";
import { CreateReleaseContributorDto } from "./dto/create-release-contributor.dto";
import { UpdateReleaseContributorDto } from "./dto/update-release-contributor.dto";
import { UUID } from "../../types/common.types";
import { CatalogAccessService } from "../catalog-access/catalog-access.service";

@Controller("release-contributors")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReleaseContributorsController {
  constructor(
    private readonly releaseContributorsService: ReleaseContributorsService,
    private readonly catalogAccess: CatalogAccessService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async create(
    @Body() dto: CreateReleaseContributorDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteRelease(dto.releaseId, user);
    const releaseContributor = await this.releaseContributorsService.create(
      dto,
      user.id,
    );
    return {
      message: "Release contributor added successfully",
      data: releaseContributor,
    };
  }

  @Patch(":id")
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateReleaseContributorDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteReleaseContributor(id, user);
    const releaseContributor = await this.releaseContributorsService.update(
      id as UUID,
      dto,
    );
    return {
      message: "Release contributor updated successfully",
      data: releaseContributor,
    };
  }

  @Get()
  @Permissions(PERMISSIONS.READ_RELEASE)
  async findByReleaseId(
    @Query("releaseId") releaseId: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanReadRelease(releaseId, user);
    const releaseContributors =
      await this.releaseContributorsService.findByReleaseId(releaseId as UUID);
    return {
      message: "Release contributors fetched successfully",
      data: releaseContributors,
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteReleaseContributor(id, user);
    await this.releaseContributorsService.delete(id as UUID);
    return { message: "Release contributor removed successfully" };
  }
}
