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
import { CreateReleaseNavigationFlowDto } from './dto/create-release-navigation-flow.dto';
import { CompleteReleaseNavigationFlowDto } from './dto/complete-release-navigation-flow.dto';
import { ReleaseNavigationFlowsService } from './release-navigation-flows.service';

@Controller('release-navigation-flows')
@UseGuards(JwtAuthGuard)
export class ReleaseNavigationFlowsController {
  constructor(
    private readonly releaseNavigationFlowsService: ReleaseNavigationFlowsService,
  ) {}

  @Get()
  async fetchAllReleaseNavigationFlows(@Query('releaseId') releaseId: string) {
    if (!releaseId) {
      throw new BadRequestException('releaseId query parameter is required');
    }

    const flows = await this.releaseNavigationFlowsService.fetchAllReleaseNavigationFlows(
      releaseId,
    );

    return {
      message: 'Release navigation flows fetched successfully',
      data: flows,
    };
  }

  @Post()
  async createOrActivateNavigationFlow(@Body() dto: CreateReleaseNavigationFlowDto) {
    const payload = await this.releaseNavigationFlowsService.createOrActivateNavigationFlow(dto);

    return {
      message: 'Release navigation flow updated successfully',
      data: payload,
    };
  }

  @Patch(':id/complete')
  async completeNavigationFlow(
    @Param('id') id: string,
    @Body() dto: CompleteReleaseNavigationFlowDto,
  ) {
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
