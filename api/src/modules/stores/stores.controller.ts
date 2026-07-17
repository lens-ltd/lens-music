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
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../constants/permission.constants';
import { StoresService } from './stores.service';
import {
  AuthUser,
  CurrentUser,
} from '../../common/decorators/current-user.decorator';
import { AssignReleaseStoresDto } from './dto/assign-release-stores.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { CatalogAccessService } from '../catalog-access/catalog-access.service';

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly catalogAccess: CatalogAccessService,
  ) {}

  @Get('stores')
  @Permissions(PERMISSIONS.READ_STORE)
  async fetchStores(@Query('isActive') isActive?: string) {
    let isActiveFilter: boolean | undefined;
    if (isActive === 'true') {
      isActiveFilter = true;
    } else if (isActive === 'false') {
      isActiveFilter = false;
    }

    const stores = await this.storesService.fetchStores({
      isActive: isActiveFilter,
    });
    return { message: 'Stores fetched successfully', data: stores };
  }

  @Get('stores/:id')
  @Permissions(PERMISSIONS.READ_STORE)
  async getStore(@Param('id') id: string) {
    const store = await this.storesService.getStoreById(id);
    return { message: 'Store retrieved successfully', data: store };
  }

  @Patch('stores/:id')
  @Permissions(PERMISSIONS.UPDATE_STORE)
  async updateStore(
    @Param('id') id: string,
    @Body() dto: UpdateStoreDto,
  ) {
    const store = await this.storesService.updateStore(id, dto);
    return { message: 'Store updated successfully', data: store };
  }

  @Post('releases/:id/stores')
  @Permissions(PERMISSIONS.ASSIGN_RELEASE_STORE)
  @HttpCode(HttpStatus.CREATED)
  async assignReleaseStores(
    @Param('id') releaseId: string,
    @Body() dto: AssignReleaseStoresDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteRelease(releaseId, user);
    const releaseStores = await this.storesService.assignReleaseStores(
      releaseId,
      dto,
      user.id,
    );

    return {
      message: 'Release stores assigned successfully',
      data: releaseStores,
    };
  }

  @Get('releases/:id/stores')
  @Permissions(PERMISSIONS.READ_RELEASE)
  async findReleaseStores(
    @Param('id') releaseId: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanReadRelease(releaseId, user);
    const releaseStores = await this.storesService.findReleaseStores(releaseId);
    return {
      message: 'Release stores fetched successfully',
      data: releaseStores,
    };
  }

  @Delete('releases/:id/stores/:releaseStoreId')
  @HttpCode(HttpStatus.OK)
  @Permissions(PERMISSIONS.ASSIGN_RELEASE_STORE)
  async deleteReleaseStore(
    @Param('id') releaseId: string,
    @Param('releaseStoreId') releaseStoreId: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteRelease(releaseId, user);
    await this.storesService.deleteReleaseStore(releaseId, releaseStoreId);
    return { message: 'Release store removed successfully' };
  }
}
