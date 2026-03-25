import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReleaseTerritoryDetail } from '../../entities/release-territory-detail.entity';
import { Release } from '../../entities/release.entity';
import { ReleaseTerritoryDetailsController } from './release-territory-details.controller';
import { ReleaseTerritoryDetailsService } from './release-territory-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReleaseTerritoryDetail, Release])],
  controllers: [ReleaseTerritoryDetailsController],
  providers: [ReleaseTerritoryDetailsService],
})
export class ReleaseTerritoryDetailsModule {}
