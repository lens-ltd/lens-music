import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor } from '../../entities/contributor.entity';
import { ContributorMembership } from '../../entities/contributor-membership.entity';
import { ContributorsController } from './contributors.controller';
import { ContributorMembershipsController } from './contributor-memberships.controller';
import { ContributorService } from './contributors.service';
import { ContributorMembershipService } from './contributor-membership.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contributor, ContributorMembership])],
  controllers: [ContributorsController, ContributorMembershipsController],
  providers: [ContributorService, ContributorMembershipService],
})
export class ContributorsModule {}
