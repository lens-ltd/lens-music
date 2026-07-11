import { Injectable, NotFoundException } from "@nestjs/common";
import { FindOptionsWhere, Repository } from "typeorm";
import { ContributorMembership } from "../../entities/contributor-membership.entity";
import { InjectRepository } from "@nestjs/typeorm";
import {
  getPagination,
  getPagingData,
  Pagination,
} from "../../helpers/pagination.helper";
import { ContributorAccessService } from "./contributor-access.service";
import { AuthUser } from "../../common/decorators/current-user.decorator";
import { UUID } from "../../types/common.types";

@Injectable()
export class ContributorMembershipService {
  constructor(
    @InjectRepository(ContributorMembership)
    private readonly contributorMembershipRepository: Repository<ContributorMembership>,
    private readonly contributorAccess: ContributorAccessService,
  ) {}

  /**
   * Membership writes require manage rights on the parent contributor.
   */
  async createContributorMembership(
    contributorMembership: Partial<ContributorMembership>,
    actor?: AuthUser,
  ): Promise<ContributorMembership> {
    if (contributorMembership.parentContributorId) {
      await this.contributorAccess.assertCanManage(
        actor,
        contributorMembership.parentContributorId as UUID,
      );
    }
    return this.contributorMembershipRepository.save(contributorMembership);
  }

  async fetchContributorMemberships(query: {
    size: number;
    page: number;
    filters?: FindOptionsWhere<ContributorMembership>;
  }): Promise<Pagination> {
    const { size, page, filters } = query;
    const { take, skip } = getPagination({ size, page });
    const contributorMemberships =
      await this.contributorMembershipRepository.findAndCount({
        where: filters,
        relations: ["memberContributor", "parentContributor"],
        take,
        skip,
      });
    return getPagingData({ data: contributorMemberships, size, page });
  }

  async deleteContributorMembership(
    id: string,
    actor?: AuthUser,
  ): Promise<void> {
    const membership = await this.contributorMembershipRepository.findOne({
      where: { id },
    });
    if (!membership) {
      throw new NotFoundException("Contributor membership not found");
    }
    // Manage rights required on parent contributor.
    await this.contributorAccess.assertCanManage(
      actor,
      membership.parentContributorId,
    );
    await this.contributorMembershipRepository.delete(id);
  }
}
