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
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../constants/permission.constants';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { AssignUserRoleDto } from './dto/assign-user-role.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Permissions(PERMISSIONS.READ_USER)
  async listUsers(@Query() query: ListUsersQueryDto) {
    const data = await this.userService.listUsers({
      page: query.page ?? 0,
      size: query.size ?? 10,
    });

    return {
      message: 'Users retrieved.',
      data,
    };
  }

  @Get(':id')
  @Permissions(PERMISSIONS.READ_USER)
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getUserDetails(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'User retrieved.',
      data: user,
    };
  }

  @Patch(':id/role')
  @Permissions(PERMISSIONS.UPDATE_USER)
  async assignUserRole(
    @Param('id') id: string,
    @Body() assignUserRoleDto: AssignUserRoleDto,
  ) {
    const user = await this.userService.assignUserRole(
      id,
      assignUserRoleDto.roleId,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'Role assigned successfully.',
      data: user,
    };
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.DELETE_USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    const deletedUser = await this.userService.deleteUser(id);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
  }
}
