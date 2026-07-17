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
import { DealsService } from "./deals.service";
import { CreateDealDto } from "./dto/create-deal.dto";
import { UpdateDealDto } from "./dto/update-deal.dto";
import { UUID } from "../../types/common.types";
import { CatalogAccessService } from "../catalog-access/catalog-access.service";

@Controller("releases/:releaseId/deals")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DealsController {
  constructor(
    private readonly dealsService: DealsService,
    private readonly catalogAccess: CatalogAccessService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async create(
    @Param("releaseId") releaseId: string,
    @Body() dto: CreateDealDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteRelease(releaseId, user);
    const deal = await this.dealsService.create(
      releaseId as UUID,
      dto,
      user.id,
    );
    return {
      message: "Deal created successfully",
      data: deal,
    };
  }

  @Get()
  @Permissions(PERMISSIONS.READ_RELEASE)
  async findByReleaseId(
    @Param("releaseId") releaseId: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanReadRelease(releaseId, user);
    const deals = await this.dealsService.findByReleaseId(releaseId as UUID);
    return {
      message: "Deals fetched successfully",
      data: deals,
    };
  }

  @Patch(":dealId")
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async update(
    @Param("releaseId") releaseId: string,
    @Param("dealId") dealId: string,
    @Body() dto: UpdateDealDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteRelease(releaseId, user);
    const deal = await this.dealsService.update(
      releaseId as UUID,
      dealId as UUID,
      dto,
    );
    return {
      message: "Deal updated successfully",
      data: deal,
    };
  }

  @Delete(":dealId")
  @HttpCode(HttpStatus.OK)
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async delete(
    @Param("releaseId") releaseId: string,
    @Param("dealId") dealId: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteRelease(releaseId, user);
    await this.dealsService.delete(releaseId as UUID, dealId as UUID);
    return { message: "Deal deleted successfully" };
  }
}
