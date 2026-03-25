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
import { ReleaseLabelsService } from "./release-labels.service";
import { CreateReleaseLabelDto } from "./dto/create-release-label.dto";
import { UpdateReleaseLabelDto } from "./dto/update-release-label.dto";
import { UUID } from "../../types/common.types";

@Controller("releases/:releaseId/labels")
@UseGuards(JwtAuthGuard)
export class ReleaseLabelsController {
  constructor(
    private readonly releaseLabelsService: ReleaseLabelsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param("releaseId") releaseId: string,
    @Body() dto: CreateReleaseLabelDto,
    @CurrentUser() user: AuthUser,
  ) {
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
  async findByReleaseId(@Param("releaseId") releaseId: string) {
    const releaseLabels = await this.releaseLabelsService.findByReleaseId(
      releaseId as UUID,
    );
    return {
      message: "Release labels fetched successfully",
      data: releaseLabels,
    };
  }

  @Patch(":releaseLabelId")
  async update(
    @Param("releaseId") releaseId: string,
    @Param("releaseLabelId") releaseLabelId: string,
    @Body() dto: UpdateReleaseLabelDto,
  ) {
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
  async delete(
    @Param("releaseId") releaseId: string,
    @Param("releaseLabelId") releaseLabelId: string,
  ) {
    await this.releaseLabelsService.delete(
      releaseId as UUID,
      releaseLabelId as UUID,
    );
    return { message: "Label removed from release successfully" };
  }
}
