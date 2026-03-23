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
import { AdminGuard } from '../../common/guards/admin.guard';
import { ListUsersQueryDto } from './dto/list-users-query.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    const deletedUser = await this.userService.deleteUser(id);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
  }
}
