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
} from '@nestjs/common';
import {
  CurrentUser,
  AuthUser,
} from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RelatedReleasesService } from './related-releases.service';
import { CreateRelatedReleaseDto } from './dto/create-related-release.dto';
import { UpdateRelatedReleaseDto } from './dto/update-related-release.dto';
import { UUID } from '../../types/common.types';

@Controller('releases/:releaseId/related-releases')
@UseGuards(JwtAuthGuard)
export class RelatedReleasesController {
  constructor(private readonly relatedReleasesService: RelatedReleasesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('releaseId') releaseId: string,
    @Body() dto: CreateRelatedReleaseDto,
    @CurrentUser() user: AuthUser,
  ) {
    const data = await this.relatedReleasesService.create(
      releaseId as UUID,
      dto,
      user.id,
    );
    return { message: 'Related release created successfully', data };
  }

  @Get()
  async findByReleaseId(@Param('releaseId') releaseId: string) {
    const data = await this.relatedReleasesService.findByReleaseId(
      releaseId as UUID,
    );
    return { message: 'Related releases fetched successfully', data };
  }

  @Patch(':id')
  async update(
    @Param('releaseId') releaseId: string,
    @Param('id') id: string,
    @Body() dto: UpdateRelatedReleaseDto,
  ) {
    const data = await this.relatedReleasesService.update(
      releaseId as UUID,
      id as UUID,
      dto,
    );
    return { message: 'Related release updated successfully', data };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('releaseId') releaseId: string,
    @Param('id') id: string,
  ) {
    await this.relatedReleasesService.delete(releaseId as UUID, id as UUID);
    return { message: 'Related release removed successfully' };
  }
}
