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

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('stores')
  @Permissions(PERMISSIONS.READ_STORE)
  async fetchStores() {
    const stores = await this.storesService.fetchStores();
    return { message: 'Stores fetched successfully', data: stores };
  }

  @Patch('stores/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.UPDATE_STORE)
  async updateStore(
    @Param('id') id: string,
    @Body() dto: UpdateStoreDto,
  ) {
    const store = await this.storesService.updateStore(id, dto);
    return { message: 'Store updated successfully', data: store };
  }

  @Post('releases/:id/stores')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.ASSIGN_RELEASE_STORE)
  @HttpCode(HttpStatus.CREATED)
  async assignReleaseStores(
    @Param('id') releaseId: string,
    @Body() dto: AssignReleaseStoresDto,
    @CurrentUser() user: AuthUser,
  ) {
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
  async findReleaseStores(@Param('id') releaseId: string) {
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
  ) {
    await this.storesService.deleteReleaseStore(releaseId, releaseStoreId);
    return { message: 'Release store removed successfully' };
  }
}
