import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor } from '../../entities/contributor.entity';
import { ContributorMembership } from '../../entities/contributor-membership.entity';
import { ContributorManager } from '../../entities/contributor-manager.entity';
import { User } from '../../entities/user.entity';
import { ContributorsController } from './contributors.controller';
import { ContributorMembershipsController } from './contributor-memberships.controller';
import { ContributorService } from './contributors.service';
import { ContributorMembershipService } from './contributor-membership.service';
import { ContributorAccessService } from './contributor-access.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contributor,
      ContributorMembership,
      ContributorManager,
      User,
    ]),
    EmailModule,
  ],
  controllers: [ContributorsController, ContributorMembershipsController],
  providers: [
    ContributorService,
    ContributorMembershipService,
    ContributorAccessService,
  ],
  exports: [ContributorAccessService, ContributorService],
})
export class ContributorsModule {}
