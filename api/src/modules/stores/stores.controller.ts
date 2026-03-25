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
import { AdminGuard } from '../../common/guards/admin.guard';
import { StoresService } from './stores.service';
import {
  AuthUser,
  CurrentUser,
} from '../../common/decorators/current-user.decorator';
import { AssignReleaseStoresDto } from './dto/assign-release-stores.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('stores')
  async fetchStores() {
    const stores = await this.storesService.fetchStores();
    return { message: 'Stores fetched successfully', data: stores };
  }

  @Patch('stores/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateStore(
    @Param('id') id: string,
    @Body() dto: UpdateStoreDto,
  ) {
    const store = await this.storesService.updateStore(id, dto);
    return { message: 'Store updated successfully', data: store };
  }

  @Post('releases/:id/stores')
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
  async findReleaseStores(@Param('id') releaseId: string) {
    const releaseStores = await this.storesService.findReleaseStores(releaseId);
    return {
      message: 'Release stores fetched successfully',
      data: releaseStores,
    };
  }

  @Delete('releases/:id/stores/:releaseStoreId')
  @HttpCode(HttpStatus.OK)
  async deleteReleaseStore(
    @Param('id') releaseId: string,
    @Param('releaseStoreId') releaseStoreId: string,
  ) {
    await this.storesService.deleteReleaseStore(releaseId, releaseStoreId);
    return { message: 'Release store removed successfully' };
  }
}
