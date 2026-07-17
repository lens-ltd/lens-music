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
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../constants/permission.constants';
import { ReleaseTerritoryDetailsService } from './release-territory-details.service';
import { CreateReleaseTerritoryDetailDto } from './dto/create-release-territory-detail.dto';
import { UpdateReleaseTerritoryDetailDto } from './dto/update-release-territory-detail.dto';
import { UUID } from '../../types/common.types';
import { CatalogAccessService } from '../catalog-access/catalog-access.service';

@Controller('releases/:releaseId/territory-details')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReleaseTerritoryDetailsController {
  constructor(
    private readonly territoryDetailsService: ReleaseTerritoryDetailsService,
    private readonly catalogAccess: CatalogAccessService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async create(
    @Param('releaseId') releaseId: string,
    @Body() dto: CreateReleaseTerritoryDetailDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteRelease(releaseId, user);
    const data = await this.territoryDetailsService.create(
      releaseId as UUID,
      dto,
      user.id,
    );
    return { message: 'Territory detail created successfully', data };
  }

  @Get()
  @Permissions(PERMISSIONS.READ_RELEASE)
  async findByReleaseId(
    @Param('releaseId') releaseId: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanReadRelease(releaseId, user);
    const data = await this.territoryDetailsService.findByReleaseId(
      releaseId as UUID,
    );
    return { message: 'Territory details fetched successfully', data };
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async update(
    @Param('releaseId') releaseId: string,
    @Param('id') id: string,
    @Body() dto: UpdateReleaseTerritoryDetailDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteRelease(releaseId, user);
    const data = await this.territoryDetailsService.update(
      releaseId as UUID,
      id as UUID,
      dto,
    );
    return { message: 'Territory detail updated successfully', data };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async delete(
    @Param('releaseId') releaseId: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteRelease(releaseId, user);
    await this.territoryDetailsService.delete(releaseId as UUID, id as UUID);
    return { message: 'Territory detail deleted successfully' };
  }
}
