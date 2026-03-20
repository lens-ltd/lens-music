import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TrackContributor } from "../../entities/track-contributor.entity";
import { CreateTrackContributorDto } from "./dto/create-track-contributor.dto";
import { UUID } from "../../types/common.types";
import { Track, TrackStatus } from "../../entities/track.entity";
import { Contributor } from "../../entities/contributor.entity";

@Injectable()
export class TrackContributorsService {
  constructor(
    @InjectRepository(TrackContributor)
    private readonly trackContributorRepository: Repository<TrackContributor>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(Contributor)
    private readonly contributorRepository: Repository<Contributor>,
  ) {}

  async create(
    dto: CreateTrackContributorDto,
    createdById: UUID,
  ): Promise<TrackContributor> {
    const track = await this.trackRepository.findOne({
      where: { id: dto.trackId },
    });

    if (!track) {
      throw new NotFoundException("Track not found");
    }

    const contributor = await this.contributorRepository.findOne({
      where: { id: dto.contributorId },
    });

    if (!contributor) {
      throw new NotFoundException("Contributor not found");
    }

    const existingTrackContributor =
      await this.trackContributorRepository.findOne({
        where: {
          trackId: dto.trackId,
          contributorId: dto.contributorId,
          role: dto.role,
        },
      });

    if (existingTrackContributor) {
      throw new ConflictException(
        "This contributor already has that role on the track",
      );
    }

    const trackContributor = this.trackContributorRepository.create({
      trackId: dto.trackId,
      contributorId: dto.contributorId,
      role: dto.role,
      createdById,
    });

    const savedTrackContributor =
      await this.trackContributorRepository.save(trackContributor);

    await this.trackRepository.update(dto.trackId, {
      status: TrackStatus.DRAFT,
    });

    return savedTrackContributor;
  }

  async findByTrackId(trackId: UUID): Promise<TrackContributor[]> {
    return this.trackContributorRepository.find({
      where: { trackId },
      relations: ["contributor"],
      order: { createdAt: "ASC" },
    });
  }

  async delete(id: UUID): Promise<void> {
    const trackContributor = await this.trackContributorRepository.findOne({
      where: { id },
    });

    if (!trackContributor) {
      throw new NotFoundException("Track contributor not found");
    }

    const result = await this.trackContributorRepository.delete(id);
    if (result?.affected === 0) {
      throw new NotFoundException("Track contributor not found");
    }

    await this.trackRepository.update(trackContributor.trackId, {
      status: TrackStatus.DRAFT,
    });
  }
}
