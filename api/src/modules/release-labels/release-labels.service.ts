import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReleaseLabel } from "../../entities/release-label.entity";
import { Release } from "../../entities/release.entity";
import { Label } from "../../entities/label.entity";
import { CreateReleaseLabelDto } from "./dto/create-release-label.dto";
import { UpdateReleaseLabelDto } from "./dto/update-release-label.dto";
import { UUID } from "../../types/common.types";
import { ReleaseStatus } from "../../constants/release.constants";
import { ReleaseLabelType } from "../../constants/release-label.constants";

@Injectable()
export class ReleaseLabelsService {
  constructor(
    @InjectRepository(ReleaseLabel)
    private readonly releaseLabelRepository: Repository<ReleaseLabel>,
    @InjectRepository(Release)
    private readonly releaseRepository: Repository<Release>,
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
  ) {}

  async create(
    releaseId: UUID,
    dto: CreateReleaseLabelDto,
    createdById: UUID,
  ): Promise<ReleaseLabel> {
    const release = await this.releaseRepository.findOne({
      where: { id: releaseId },
    });

    if (!release) {
      throw new NotFoundException("Release not found");
    }

    const label = await this.labelRepository.findOne({
      where: { id: dto.labelId },
    });

    if (!label) {
      throw new NotFoundException("Label not found");
    }

    const existing = await this.releaseLabelRepository.findOne({
      where: { releaseId, labelId: dto.labelId },
    });

    if (existing) {
      throw new ConflictException(
        "This label is already assigned to the release",
      );
    }

    const requestedType = dto.type ?? ReleaseLabelType.PRIMARY;

    if (requestedType === ReleaseLabelType.PRIMARY) {
      await this.ensureNoPrimaryConflict(releaseId);
    }

    // If this is the first label, always set as PRIMARY
    const existingLabels = await this.releaseLabelRepository.count({
      where: { releaseId },
    });

    const type =
      existingLabels === 0 ? ReleaseLabelType.PRIMARY : requestedType;

    const releaseLabel = this.releaseLabelRepository.create({
      releaseId,
      labelId: dto.labelId,
      type,
      ownership: dto.ownership?.trim() || undefined,
      createdById,
    });

    const saved = await this.releaseLabelRepository.save(releaseLabel);
    await this.resetValidatedReleaseToDraft(releaseId);

    return this.releaseLabelRepository.findOneOrFail({
      where: { id: saved.id },
      relations: ["label"],
    });
  }

  async findByReleaseId(releaseId: UUID): Promise<ReleaseLabel[]> {
    return this.releaseLabelRepository.find({
      where: { releaseId },
      relations: ["label"],
      order: { type: "ASC", createdAt: "ASC" },
    });
  }

  async update(
    releaseId: UUID,
    releaseLabelId: UUID,
    dto: UpdateReleaseLabelDto,
  ): Promise<ReleaseLabel> {
    const releaseLabel = await this.releaseLabelRepository.findOne({
      where: { id: releaseLabelId, releaseId },
    });

    if (!releaseLabel) {
      throw new NotFoundException("Release label not found");
    }

    if (dto.type === ReleaseLabelType.PRIMARY) {
      await this.ensureNoPrimaryConflict(releaseId, releaseLabelId);
    }

    if (dto.type !== undefined) {
      releaseLabel.type = dto.type;
    }

    if (dto.ownership !== undefined) {
      releaseLabel.ownership = dto.ownership?.trim() || undefined;
    }

    const saved = await this.releaseLabelRepository.save(releaseLabel);
    await this.resetValidatedReleaseToDraft(releaseId);

    return this.releaseLabelRepository.findOneOrFail({
      where: { id: saved.id },
      relations: ["label"],
    });
  }

  async delete(releaseId: UUID, releaseLabelId: UUID): Promise<void> {
    const releaseLabel = await this.releaseLabelRepository.findOne({
      where: { id: releaseLabelId, releaseId },
    });

    if (!releaseLabel) {
      throw new NotFoundException("Release label not found");
    }

    if (releaseLabel.type === ReleaseLabelType.PRIMARY) {
      throw new BadRequestException(
        "Cannot remove the primary label. Assign another label as primary first.",
      );
    }

    await this.releaseLabelRepository.delete(releaseLabelId);
    await this.resetValidatedReleaseToDraft(releaseId);
  }

  private async ensureNoPrimaryConflict(
    releaseId: UUID,
    excludeId?: UUID,
  ): Promise<void> {
    const existingPrimary = await this.releaseLabelRepository.findOne({
      where: { releaseId, type: ReleaseLabelType.PRIMARY },
    });

    if (existingPrimary && existingPrimary.id !== excludeId) {
      throw new ConflictException(
        "A primary label already exists for this release. Change the existing primary label first.",
      );
    }
  }

  private async resetValidatedReleaseToDraft(releaseId: UUID): Promise<void> {
    const release = await this.releaseRepository.findOne({
      where: { id: releaseId },
    });

    if (release?.status === ReleaseStatus.VALIDATED) {
      await this.releaseRepository.update(releaseId, {
        status: ReleaseStatus.DRAFT,
      });
    }
  }
}
