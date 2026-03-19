import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor } from '../../entities/contributor.entity';
import { ContributorsController } from './contributors.controller';
import { ContributorService } from './contributors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contributor])],
  controllers: [ContributorsController],
  providers: [ContributorService],
})
export class ContributorsModule {}
