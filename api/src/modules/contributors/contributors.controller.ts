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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { ContributorService } from './contributors.service';
import { CreateContributorDto } from './dto/create-contributor.dto';
import { UpdateContributorDto } from './dto/update-contributor.dto';
import { UUID } from '../../types/common.types';
import { Contributor } from '../../entities/contributor.entity';
import { FindOptionsWhere } from 'typeorm';

@Controller('contributors')
@UseGuards(JwtAuthGuard)
export class ContributorsController {
  constructor(private readonly contributorService: ContributorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateContributorDto, @CurrentUser() user: AuthUser) {
    const contributor = await this.contributorService.create(dto, user.id);
    return { message: 'Contributor created successfully', data: contributor };
  }

  @Get()
  async findAll(
    @Query('size') size = '10',
    @Query('page') page = '0',
    @Query('parentContributorId') parentContributorId?: UUID,
    @Query('type') type?: string,
    @Query('searchName') searchName?: string,
  ) {
    const condition: FindOptionsWhere<Contributor> = {};
    if (parentContributorId) {
      (condition as Record<string, unknown>).parentContributorId = parentContributorId;
    }
    if (type) {
      condition.type = type as Contributor['type'];
    }

    const data = await this.contributorService.findAll({
      size: Number(size),
      page: Number(page),
      condition: Object.keys(condition).length > 0 ? condition : undefined,
      searchName,
    });
    return { message: 'Contributors fetched successfully', data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const contributor = await this.contributorService.findOne(id);
    if (!contributor) {
      throw new NotFoundException('Contributor not found');
    }
    return { message: 'Contributor fetched successfully', data: contributor };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateContributorDto) {
    const contributor = await this.contributorService.update(id, dto);
    return { message: 'Contributor updated successfully', data: contributor };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.contributorService.remove(id);
  }

}
