import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { User } from '../../entities/user.entity';
import { Label } from '../../entities/label.entity';
import { Release } from '../../entities/release.entity';
import { Role } from '../../entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Label, Release, Role])],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}