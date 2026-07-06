import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../constants/permission.constants';
import { StaticReleaseNavigationService } from './static-release-navigation.service';

@Controller('static-release-navigation')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StaticReleaseNavigationController {
  constructor(
    private readonly staticReleaseNavigationService: StaticReleaseNavigationService,
  ) {}

  @Get()
  @Permissions(PERMISSIONS.READ_RELEASE)
  async fetchAllSteps() {
    const steps = await this.staticReleaseNavigationService.fetchAllSteps();
    return { message: 'Static release navigation steps fetched successfully', data: steps };
  }
}
