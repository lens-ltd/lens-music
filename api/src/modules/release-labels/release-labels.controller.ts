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
import { ReleaseLabelsService } from "./release-labels.service";
import { CreateReleaseLabelDto } from "./dto/create-release-label.dto";
import { UpdateReleaseLabelDto } from "./dto/update-release-label.dto";
import { UUID } from "../../types/common.types";
import { CatalogAccessService } from "../catalog-access/catalog-access.service";

@Controller("releases/:releaseId/labels")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReleaseLabelsController {
  constructor(
    private readonly releaseLabelsService: ReleaseLabelsService,
    private readonly catalogAccess: CatalogAccessService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async create(
    @Param("releaseId") releaseId: string,
    @Body() dto: CreateReleaseLabelDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteRelease(releaseId, user);
    const releaseLabel = await this.releaseLabelsService.create(
      releaseId as UUID,
      dto,
      user.id,
    );
    return {
      message: "Label added to release successfully",
      data: releaseLabel,
    };
  }

  @Get()
  @Permissions(PERMISSIONS.READ_RELEASE)
  async findByReleaseId(
    @Param("releaseId") releaseId: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanReadRelease(releaseId, user);
    const releaseLabels = await this.releaseLabelsService.findByReleaseId(
      releaseId as UUID,
    );
    return {
      message: "Release labels fetched successfully",
      data: releaseLabels,
    };
  }

  @Patch(":releaseLabelId")
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async update(
    @Param("releaseId") releaseId: string,
    @Param("releaseLabelId") releaseLabelId: string,
    @Body() dto: UpdateReleaseLabelDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteRelease(releaseId, user);
    const releaseLabel = await this.releaseLabelsService.update(
      releaseId as UUID,
      releaseLabelId as UUID,
      dto,
    );
    return {
      message: "Release label updated successfully",
      data: releaseLabel,
    };
  }

  @Delete(":releaseLabelId")
  @HttpCode(HttpStatus.OK)
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async delete(
    @Param("releaseId") releaseId: string,
    @Param("releaseLabelId") releaseLabelId: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteRelease(releaseId, user);
    await this.releaseLabelsService.delete(
      releaseId as UUID,
      releaseLabelId as UUID,
    );
    return { message: "Label removed from release successfully" };
  }
}
