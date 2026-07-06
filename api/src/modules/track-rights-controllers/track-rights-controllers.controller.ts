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
import { TrackRightsControllersService } from "./track-rights-controllers.service";
import { CreateTrackRightsControllerDto } from "./dto/create-track-rights-controller.dto";
import { UpdateTrackRightsControllerDto } from "./dto/update-track-rights-controller.dto";
import { UUID } from "../../types/common.types";

@Controller("tracks/:trackId/rights-controllers")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TrackRightsControllersController {
  constructor(
    private readonly trackRightsControllersService: TrackRightsControllersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(PERMISSIONS.UPDATE_TRACK)
  async create(
    @Param("trackId") trackId: string,
    @Body() dto: CreateTrackRightsControllerDto,
    @CurrentUser() user: AuthUser,
  ) {
    const trc = await this.trackRightsControllersService.create(
      trackId as UUID,
      dto,
      user.id,
    );
    return {
      message: "Track rights controller created successfully",
      data: trc,
    };
  }

  @Get()
  @Permissions(PERMISSIONS.READ_TRACK)
  async findByTrackId(@Param("trackId") trackId: string) {
    const trcs = await this.trackRightsControllersService.findByTrackId(
      trackId as UUID,
    );
    return {
      message: "Track rights controllers fetched successfully",
      data: trcs,
    };
  }

  @Patch(":trcId")
  @Permissions(PERMISSIONS.UPDATE_TRACK)
  async update(
    @Param("trackId") trackId: string,
    @Param("trcId") trcId: string,
    @Body() dto: UpdateTrackRightsControllerDto,
  ) {
    const trc = await this.trackRightsControllersService.update(
      trackId as UUID,
      trcId as UUID,
      dto,
    );
    return {
      message: "Track rights controller updated successfully",
      data: trc,
    };
  }

  @Delete(":trcId")
  @HttpCode(HttpStatus.OK)
  @Permissions(PERMISSIONS.UPDATE_TRACK)
  async delete(
    @Param("trackId") trackId: string,
    @Param("trcId") trcId: string,
  ) {
    await this.trackRightsControllersService.delete(
      trackId as UUID,
      trcId as UUID,
    );
    return { message: "Track rights controller deleted successfully" };
  }
}
