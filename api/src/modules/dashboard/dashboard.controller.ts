import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  AuthUser,
  CurrentUser,
} from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PERMISSIONS } from '../../constants/permission.constants';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @Permissions(PERMISSIONS.READ_RELEASE)
  async getSummary(@CurrentUser() user: AuthUser) {
    const summary = await this.dashboardService.getSummary(user.id);
    return {
      message: 'Dashboard summary fetched successfully',
      data: summary,
    };
  }
}
