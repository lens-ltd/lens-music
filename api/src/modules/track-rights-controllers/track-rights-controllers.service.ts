import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TrackRightsController } from "../../entities/track-rights-controller.entity";
import { Track } from "../../entities/track.entity";
import { Contributor } from "../../entities/contributor.entity";
import { Label } from "../../entities/label.entity";
import { CreateTrackRightsControllerDto } from "./dto/create-track-rights-controller.dto";
import { UpdateTrackRightsControllerDto } from "./dto/update-track-rights-controller.dto";
import { UUID } from "../../types/common.types";
import { ReleaseStatus } from "../../constants/release.constants";

@Injectable()
export class TrackRightsControllersService {
  constructor(
    @InjectRepository(TrackRightsController)
    private readonly trcRepository: Repository<TrackRightsController>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(Contributor)
    private readonly contributorRepository: Repository<Contributor>,
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
  ) {}

  async create(
    trackId: UUID,
    dto: CreateTrackRightsControllerDto,
    createdById: UUID,
  ): Promise<TrackRightsController> {
    const track = await this.trackRepository.findOne({
      where: { id: trackId },
    });

    if (!track) {
      throw new NotFoundException("Track not found");
    }

    if (dto.contributorId) {
      const contributor = await this.contributorRepository.findOne({
        where: { id: dto.contributorId },
      });
      if (!contributor) {
        throw new NotFoundException("Contributor not found");
      }
    }

    if (dto.labelId) {
      const label = await this.labelRepository.findOne({
        where: { id: dto.labelId },
      });
      if (!label) {
        throw new NotFoundException("Label not found");
      }
    }

    if (dto.territories.length === 0) {
      throw new BadRequestException("At least one territory is required");
    }

    const trc = this.trcRepository.create({
      trackId,
      contributorId: dto.contributorId || undefined,
      labelId: dto.labelId || undefined,
      controllerName: dto.controllerName.trim(),
      rightType: dto.rightType,
      territories: dto.territories,
      rightSharePercentage: dto.rightSharePercentage || undefined,
      delegatedUsageRights: dto.delegatedUsageRights || undefined,
      createdById,
    });

    const saved = await this.trcRepository.save(trc);
    await this.resetValidatedReleaseToDraft(track.releaseId);

    return this.trcRepository.findOneOrFail({
      where: { id: saved.id },
      relations: ["contributor", "label"],
    });
  }

  async findByTrackId(trackId: UUID): Promise<TrackRightsController[]> {
    return this.trcRepository.find({
      where: { trackId },
      relations: ["contributor", "label"],
      order: { createdAt: "ASC" },
    });
  }

  async update(
    trackId: UUID,
    trcId: UUID,
    dto: UpdateTrackRightsControllerDto,
  ): Promise<TrackRightsController> {
    const trc = await this.trcRepository.findOne({
      where: { id: trcId, trackId },
    });

    if (!trc) {
      throw new NotFoundException("Track rights controller not found");
    }

    if (dto.contributorId !== undefined) {
      if (dto.contributorId) {
        const contributor = await this.contributorRepository.findOne({
          where: { id: dto.contributorId },
        });
        if (!contributor) {
          throw new NotFoundException("Contributor not found");
        }
      }
      trc.contributorId = dto.contributorId || undefined;
    }

    if (dto.labelId !== undefined) {
      if (dto.labelId) {
        const label = await this.labelRepository.findOne({
          where: { id: dto.labelId },
        });
        if (!label) {
          throw new NotFoundException("Label not found");
        }
      }
      trc.labelId = dto.labelId || undefined;
    }

    if (dto.territories !== undefined) {
      if (dto.territories.length === 0) {
        throw new BadRequestException("At least one territory is required");
      }
      trc.territories = dto.territories;
    }

    if (dto.controllerName !== undefined) trc.controllerName = dto.controllerName.trim();
    if (dto.rightType !== undefined) trc.rightType = dto.rightType;
    if (dto.rightSharePercentage !== undefined) trc.rightSharePercentage = dto.rightSharePercentage || undefined;
    if (dto.delegatedUsageRights !== undefined) trc.delegatedUsageRights = dto.delegatedUsageRights || undefined;

    const saved = await this.trcRepository.save(trc);

    const track = await this.trackRepository.findOne({ where: { id: trackId } });
    if (track) {
      await this.resetValidatedReleaseToDraft(track.releaseId);
    }

    return this.trcRepository.findOneOrFail({
      where: { id: saved.id },
      relations: ["contributor", "label"],
    });
  }

  async delete(trackId: UUID, trcId: UUID): Promise<void> {
    const trc = await this.trcRepository.findOne({
      where: { id: trcId, trackId },
    });

    if (!trc) {
      throw new NotFoundException("Track rights controller not found");
    }

    await this.trcRepository.delete(trcId);

    const track = await this.trackRepository.findOne({ where: { id: trackId } });
    if (track) {
      await this.resetValidatedReleaseToDraft(track.releaseId);
    }
  }

  private async resetValidatedReleaseToDraft(releaseId: UUID): Promise<void> {
    const { Repository } = await import("typeorm");
    const release = await this.trackRepository.manager
      .getRepository("Release")
      .findOne({ where: { id: releaseId } }) as { id: UUID; status: string } | null;

    if (release?.status === ReleaseStatus.VALIDATED) {
      await this.trackRepository.manager
        .getRepository("Release")
        .update(releaseId, { status: ReleaseStatus.DRAFT });
    }
  }
}
