import { Injectable } from "@nestjs/common";
import { FindOptionsWhere, Repository } from "typeorm";
import { ContributorMembership } from "../../entities/contributor-membership.entity";
import { InjectRepository } from "@nestjs/typeorm";
import {
  getPagination,
  getPagingData,
  Pagination,
} from "../../helpers/pagination.helper";

@Injectable()
export class ContributorMembershipService {
  constructor(
    @InjectRepository(ContributorMembership)
    private readonly contributorMembershipRepository: Repository<ContributorMembership>,
  ) {}

  // CREATE CONTRIBUTOR MEMBERSHIP
  async createContributorMembership(
    contributorMembership: Partial<ContributorMembership>,
  ): Promise<ContributorMembership> {
    return this.contributorMembershipRepository.save(contributorMembership);
  }

  // FETCH CONTRIBUTOR MEMBERSHIPS
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
        take,
        skip,
      });
    return getPagingData({ data: contributorMemberships, size, page });
  }
}
