import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LabelService } from './labels.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../constants/permission.constants';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { CatalogAccessService } from '../catalog-access/catalog-access.service';

@Controller('labels')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LabelsController {
  constructor(
    private readonly labelService: LabelService,
    private readonly catalogAccess: CatalogAccessService,
  ) {}

  @Post()
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async createLabel(@Body() dto: CreateLabelDto, @CurrentUser() user: AuthUser) {
    const label = await this.labelService.createLabel({ ...dto, createdById: user.id });
    return { message: 'Label created successfully', data: label };
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async updateLabel(
    @Param('id') id: string,
    @Body() dto: UpdateLabelDto,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteLabel(id, user);
    const labelExists = await this.labelService.getLabelById(id);
    if (!labelExists) throw new NotFoundException('Label not found');

    const updatedLabel = await this.labelService.updateLabel({ id, ...dto } as any);
    return { message: 'Label updated successfully', data: updatedLabel };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(PERMISSIONS.UPDATE_RELEASE)
  async deleteLabel(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.catalogAccess.assertCanWriteLabel(id, user);
    const labelExists = await this.labelService.getLabelById(id);
    if (!labelExists) throw new NotFoundException('Label not found');
    await this.labelService.deleteLabel(id);
  }

  @Get()
  @Permissions(PERMISSIONS.READ_RELEASE)
  async fetchLabels(
    @Query('size') size = '10',
    @Query('page') page = '0',
    @Query('searchKey') searchKey?: string,
  ) {
    const labels = await this.labelService.fetchLabels({
      size: Number(size),
      page: Number(page),
      searchKey,
    });
    return { message: 'Labels returned successfully', data: labels };
  }

  @Get(':id')
  @Permissions(PERMISSIONS.READ_RELEASE)
  async getLabel(@Param('id') id: string) {
    const label = await this.labelService.getLabelById(id);
    if (!label) throw new NotFoundException('Label not found');
    return { message: 'Label found successfully', data: label };
  }
}
