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
import { TrackContributorsService } from "./track-contributors.service";
import { CreateTrackContributorDto } from "./dto/create-track-contributor.dto";
import { UpdateTrackContributorDto } from "./dto/update-track-contributor.dto";
import { UUID } from "../../types/common.types";

@Controller("track-contributors")
@UseGuards(JwtAuthGuard)
export class TrackContributorsController {
  constructor(
    private readonly trackContributorsService: TrackContributorsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateTrackContributorDto,
    @CurrentUser() user: AuthUser,
  ) {
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
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateTrackContributorDto,
  ) {
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
  async findByTrackId(@Query("trackId") trackId: string) {
    const trackContributors =
      await this.trackContributorsService.findByTrackId(trackId as UUID);
    return {
      message: "Track contributors fetched successfully",
      data: trackContributors,
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async delete(@Param("id") id: string) {
    await this.trackContributorsService.delete(id as UUID);
    return { message: "Track contributor removed successfully" };
  }
}
