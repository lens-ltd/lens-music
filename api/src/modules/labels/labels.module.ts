import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabelsController } from './labels.controller';
import { LabelService } from './labels.service';
import { UsersModule } from '../users/users.module';
import { Label } from '../../entities/label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Label]), UsersModule],
  controllers: [LabelsController],
  providers: [LabelService],
})
export class LabelsModule {}
