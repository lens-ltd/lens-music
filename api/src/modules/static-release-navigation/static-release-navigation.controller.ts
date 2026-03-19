import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { StaticReleaseNavigationService } from './static-release-navigation.service';

@Controller('static-release-navigation')
@UseGuards(JwtAuthGuard)
export class StaticReleaseNavigationController {
  constructor(
    private readonly staticReleaseNavigationService: StaticReleaseNavigationService,
  ) {}

  @Get()
  async fetchAllSteps() {
    const steps = await this.staticReleaseNavigationService.fetchAllSteps();
    return { message: 'Static release navigation steps fetched successfully', data: steps };
  }
}
