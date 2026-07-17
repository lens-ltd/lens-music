import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../constants/permission.constants';
import { CreateReleaseNavigationFlowDto } from './dto/create-release-navigation-flow.dto';
import { CompleteReleaseNavigationFlowDto } from './dto/complete-release-navigation-flow.dto';
import { ReleaseNavigationFlowsService } from './release-navigation-flows.service';
import { AuthUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { CatalogAccessService } from '../catalog-access/catalog-access.service';

@Controller('release-navigation-flows')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReleaseNavigationFlowsController {
  constructor(
    private readonly releaseNavigationFlowsService: ReleaseNavigationFlowsService,
    private readonly catalogAccess: CatalogAccessService,
  ) {}

  @Get()
  @Permissions(PERMISSIONS.READ_RELEASE)
  async fetchAllReleaseNavigationFlows(
    @Query('releaseId') releaseId: string,
    @CurrentUser() user: AuthUser,
  ) {
    if (!releaseId) {
      throw new BadRequestException('releaseId query parameter is required');
    }
    await this.catalogAccess.assertCanReadRelease(releaseId, user);

    const flows = await this.releaseNavigationFlowsService.fetchAllReleaseNavigationFlows(
      releaseId,
    );

    return {
      message: 'Release navigation flows fetched successfully',
      data: flows,
    };
  }

  @Post()
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async createOrActivateNavigationFlow(
    @Body() dto: CreateReleaseNavigationFlowDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteRelease(dto.releaseId, user);
    const payload = await this.releaseNavigationFlowsService.createOrActivateNavigationFlow(dto);

    return {
      message: 'Release navigation flow updated successfully',
      data: payload,
    };
  }

  @Patch(':id/complete')
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async completeNavigationFlow(
    @Param('id') id: string,
    @Body() dto: CompleteReleaseNavigationFlowDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteReleaseNavigationFlow(id, user);
    const flow = await this.releaseNavigationFlowsService.completeNavigationFlow({
      id,
      isCompleted: dto.isCompleted,
    });

    return {
      message: 'Release navigation flow completion updated successfully',
      data: flow,
    };
  }
}
