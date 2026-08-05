import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { sortContributorsForDisplay } from "../../helpers/releases.helper";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { ReleaseContributor } from "../../entities/release-contributor.entity";
import { CreateReleaseContributorDto } from "./dto/create-release-contributor.dto";
import { UpdateReleaseContributorDto } from "./dto/update-release-contributor.dto";
import { UUID } from "../../types/common.types";
import { Release } from "../../entities/release.entity";
import { ReleaseStatus } from "../../constants/release.constants";
import { Contributor } from "../../entities/contributor.entity";
import { ContributorRole } from "../../constants/contributor.constants";
import { CreateBulkReleaseContributorsDto } from "./dto/create-bulk-release-contributors.dto";

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

  async createBulk(
    dto: CreateBulkReleaseContributorsDto,
    createdById: UUID,
  ): Promise<{
    contributors: ReleaseContributor[];
    createdRoles: ContributorRole[];
    existingRoles: ContributorRole[];
  }> {
    const roles = [...new Set(dto.roles)];

    const result = await this.releaseContributorRepository.manager.transaction(
      async (manager) => {
        const releaseRepository = manager.getRepository(Release);
        const contributorRepository = manager.getRepository(Contributor);
        const creditRepository = manager.getRepository(ReleaseContributor);

        const [release, contributor] = await Promise.all([
          releaseRepository.findOne({ where: { id: dto.releaseId } }),
          contributorRepository.findOne({ where: { id: dto.contributorId } }),
        ]);

        if (!release) throw new NotFoundException("Release not found");
        if (!contributor) throw new NotFoundException("Contributor not found");

        const existing = await creditRepository.find({
          where: {
            releaseId: dto.releaseId,
            contributorId: dto.contributorId,
            role: In(roles),
          },
        });
        const existingRoles = existing.map((credit) => credit.role);
        const createdRoles = roles.filter(
          (role) => !existingRoles.includes(role),
        );

        if (createdRoles.length > 0) {
          await creditRepository
            .createQueryBuilder()
            .insert()
            .values(
              createdRoles.map((role) => ({
                releaseId: dto.releaseId,
                contributorId: dto.contributorId,
                role,
                createdById,
              })),
            )
            .orIgnore()
            .execute();

          if (release.status === ReleaseStatus.VALIDATED) {
            await releaseRepository.update(dto.releaseId, {
              status: ReleaseStatus.DRAFT,
            });
          }
        }

        const contributors = await creditRepository.find({
          where: {
            releaseId: dto.releaseId,
            contributorId: dto.contributorId,
            role: In(roles),
          },
          relations: ["contributor"],
        });

        return {
          contributors: sortContributorsForDisplay(contributors),
          createdRoles,
          existingRoles,
        };
      },
    );

    return result;
  }

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
      sequenceNumber: dto.sequenceNumber,
      createdById,
    });

    const savedReleaseContributor =
      await this.releaseContributorRepository.save(releaseContributor);

    await this.resetValidatedReleaseToDraft(dto.releaseId);

    return savedReleaseContributor;
  }

  async update(
    id: UUID,
    dto: UpdateReleaseContributorDto,
  ): Promise<ReleaseContributor> {
    const releaseContributor = await this.releaseContributorRepository.findOne({
      where: { id },
    });

    if (!releaseContributor) {
      throw new NotFoundException("Release contributor not found");
    }

    if (dto.sequenceNumber !== undefined) {
      releaseContributor.sequenceNumber = dto.sequenceNumber;
    }

    const saved = await this.releaseContributorRepository.save(releaseContributor);

    await this.resetValidatedReleaseToDraft(releaseContributor.releaseId);

    return saved;
  }

  async findByReleaseId(releaseId: UUID): Promise<ReleaseContributor[]> {
    const rows = await this.releaseContributorRepository.find({
      where: { releaseId },
      relations: ["contributor"],
    });
    return sortContributorsForDisplay(rows);
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

    await this.resetValidatedReleaseToDraft(releaseContributor.releaseId);
  }

  private async resetValidatedReleaseToDraft(releaseId: UUID): Promise<void> {
    const release = await this.releaseRepository.findOne({ where: { id: releaseId } });

    if (release?.status === ReleaseStatus.VALIDATED) {
      await this.releaseRepository.update(releaseId, {
        status: ReleaseStatus.DRAFT,
      });
    }
  }
}
