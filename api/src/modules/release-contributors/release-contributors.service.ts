import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReleaseContributor } from "../../entities/release-contributor.entity";
import { CreateReleaseContributorDto } from "./dto/create-release-contributor.dto";
import { UUID } from "../../types/common.types";
import { Release } from "../../entities/release.entity";
import { ReleaseStatus } from "../../constants/release.constants";
import { Contributor } from "../../entities/contributor.entity";

@Injectable()
export class ReleaseContributorsService {
  constructor(
    @InjectRepository(ReleaseContributor)
    private readonly releaseContributorRepository: Repository<ReleaseContributor>,
    @InjectRepository(Release)
    private readonly releaseRepository: Repository<Release>,
    @InjectRepository(Contributor)
    private readonly contributorRepository: Repository<Contributor>,
  ) {}

  async create(
    dto: CreateReleaseContributorDto,
    createdById: UUID,
  ): Promise<ReleaseContributor> {
    const release = await this.releaseRepository.findOne({
      where: { id: dto.releaseId },
    });

    if (!release) {
      throw new NotFoundException("Release not found");
    }

    const contributor = await this.contributorRepository.findOne({
      where: { id: dto.contributorId },
    });

    if (!contributor) {
      throw new NotFoundException("Contributor not found");
    }

    const existingReleaseContributor =
      await this.releaseContributorRepository.findOne({
        where: {
          releaseId: dto.releaseId,
          contributorId: dto.contributorId,
          role: dto.role,
        },
      });

    if (existingReleaseContributor) {
      throw new ConflictException(
        "This contributor already has that role on the release",
      );
    }

    const releaseContributor = this.releaseContributorRepository.create({
      releaseId: dto.releaseId,
      contributorId: dto.contributorId,
      role: dto.role,
      createdById,
    });

    const savedReleaseContributor =
      await this.releaseContributorRepository.save(releaseContributor);

    await this.releaseRepository.update(dto.releaseId, {
      status: ReleaseStatus.DRAFT,
    });

    return savedReleaseContributor;
  }

  async findByReleaseId(releaseId: UUID): Promise<ReleaseContributor[]> {
    return this.releaseContributorRepository.find({
      where: { releaseId },
      relations: ["contributor"],
      order: { createdAt: "ASC" },
    });
  }

  async delete(id: UUID): Promise<void> {
    const releaseContributor = await this.releaseContributorRepository.findOne({
      where: { id },
    });

    if (!releaseContributor) {
      throw new NotFoundException("Release contributor not found");
    }

    const result = await this.releaseContributorRepository.delete(id);
    if (result?.affected === 0) {
      throw new NotFoundException("Release contributor not found");
    }

    await this.releaseRepository.update(releaseContributor.releaseId, {
      status: ReleaseStatus.DRAFT,
    });
  }
}
