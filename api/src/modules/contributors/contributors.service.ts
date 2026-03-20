import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, ILike, Repository } from "typeorm";
import { Contributor } from "../../entities/contributor.entity";
import {
  getPagination,
  getPagingData,
  Pagination,
} from "../../helpers/pagination.helper";
import { UUID } from "../../types/common.types";
import { CreateContributorDto } from "./dto/create-contributor.dto";
import { UpdateContributorDto } from "./dto/update-contributor.dto";
import { ContributorMembership } from "../../entities/contributor-membership.entity";

@Injectable()
export class ContributorService {
  constructor(
    @InjectRepository(Contributor)
    private readonly contributorRepository: Repository<Contributor>,
    @InjectRepository(ContributorMembership)
    private readonly contributorMembershipRepository: Repository<ContributorMembership>,
  ) {}

  private getPrioritizedContributorName({
    displayName,
    name,
    fallbackName,
  }: {
    displayName?: string;
    name?: string;
    fallbackName?: string;
  }): string | undefined {
    return displayName || name || fallbackName;
  }

  async create(
    dto: CreateContributorDto,
    createdById: UUID,
  ): Promise<Contributor> {
    const prioritizedName = this.getPrioritizedContributorName({
      displayName: dto.displayName,
      name: dto.name,
    });

    const contributor = this.contributorRepository.create({
      name: prioritizedName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      country: dto.country,
      gender: dto.gender,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      displayName: dto.displayName,
      profileLinks: dto.profileLinks,
      status: dto.status,
      verificationStatus: dto.verificationStatus,
      type: dto.type,
      createdById,
    });

    const savedContributor = await this.contributorRepository.save(contributor);
    if (dto.parentContributorId) {
      await this.contributorMembershipRepository.save({
        parentContributorId: dto?.parentContributorId,
        memberContributorId: savedContributor?.id,
        createdById,
      });
    }
    return savedContributor;
  }

  async findAll({
    size,
    page,
    condition,
    searchName,
  }: {
    size?: number;
    page?: number;
    condition?: FindOptionsWhere<Contributor> | FindOptionsWhere<Contributor>[];
    searchName?: string;
  }): Promise<Pagination> {
    const { take, skip } = getPagination({ size, page });

    let where: FindOptionsWhere<Contributor> | FindOptionsWhere<Contributor>[] | undefined;

    if (searchName) {
      const baseCondition = (Array.isArray(condition) ? condition[0] : condition) || {};
      where = [
        { ...baseCondition, displayName: ILike(`%${searchName}%`) },
        { ...baseCondition, name: ILike(`%${searchName}%`) },
      ];
    } else {
      where = Array.isArray(condition)
        ? (condition as FindOptionsWhere<Contributor>[])
        : (condition as FindOptionsWhere<Contributor>);
    }

    const data = await this.contributorRepository.findAndCount({
      where,
      take,
      skip,
      order: { createdAt: "DESC" },
    });
    return getPagingData({ data, size, page });
  }

  async findOne(id: UUID): Promise<Contributor | null> {
    return this.contributorRepository.findOne({ where: { id }, relations: {  } });
  }

  async update(id: UUID, dto: UpdateContributorDto): Promise<Contributor> {
    const contributor = await this.contributorRepository.findOne({
      where: { id },
    });
    if (!contributor) {
      throw new NotFoundException("Contributor not found");
    }

    if (dto.displayName !== undefined)
      contributor.displayName = dto.displayName;
    if (dto.name !== undefined || dto.displayName !== undefined) {
      contributor.name =
        this.getPrioritizedContributorName({
          displayName: dto.displayName ?? contributor.displayName,
          name: dto.name,
          fallbackName: contributor.name,
        }) || contributor.name;
    }
    if (dto.email !== undefined) contributor.email = dto.email;
    if (dto.phoneNumber !== undefined)
      contributor.phoneNumber = dto.phoneNumber;
    if (dto.country !== undefined) contributor.country = dto.country;
    if (dto.gender !== undefined) contributor.gender = dto.gender;
    if (dto.dateOfBirth !== undefined) {
      contributor.dateOfBirth = dto.dateOfBirth
        ? new Date(dto.dateOfBirth)
        : undefined;
    }
    if (dto.profileLinks !== undefined)
      contributor.profileLinks = dto.profileLinks;
    if (dto.status !== undefined) contributor.status = dto.status;
    if (dto.verificationStatus !== undefined) {
      contributor.verificationStatus = dto.verificationStatus;
    }
    if (dto.type !== undefined) contributor.type = dto.type;

    return this.contributorRepository.save(contributor);
  }

  async remove(id: UUID): Promise<void> {
    const result = await this.contributorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException("Contributor not found");
    }
  }
}
