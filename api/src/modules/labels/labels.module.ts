import { Module } from '@nestjs/common';
import { LabelsController } from './labels.controller';
import { LabelService } from '../../services/label.service';
import { UserService } from '../../services/user.service';

@Module({
  controllers: [LabelsController],
  providers: [LabelService, UserService],
})
export class LabelsModule {}
