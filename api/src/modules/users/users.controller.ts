import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../constants/permission.constants';
import { ListUsersQueryDto } from './dto/list-users-query.dto';

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
