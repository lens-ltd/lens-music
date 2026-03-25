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
import { ReleaseContributorsService } from "./release-contributors.service";
import { CreateReleaseContributorDto } from "./dto/create-release-contributor.dto";
import { UpdateReleaseContributorDto } from "./dto/update-release-contributor.dto";
import { UUID } from "../../types/common.types";

@Controller("release-contributors")
@UseGuards(JwtAuthGuard)
export class ReleaseContributorsController {
  constructor(
    private readonly releaseContributorsService: ReleaseContributorsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateReleaseContributorDto,
    @CurrentUser() user: AuthUser,
  ) {
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
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateReleaseContributorDto,
  ) {
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
  async findByReleaseId(@Query("releaseId") releaseId: string) {
    const releaseContributors =
      await this.releaseContributorsService.findByReleaseId(releaseId as UUID);
    return {
      message: "Release contributors fetched successfully",
      data: releaseContributors,
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async delete(@Param("id") id: string) {
    await this.releaseContributorsService.delete(id as UUID);
    return { message: "Release contributor removed successfully" };
  }
}
