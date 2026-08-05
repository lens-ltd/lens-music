import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { sortContributorsForDisplay } from "../../helpers/releases.helper";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { TrackContributor } from "../../entities/track-contributor.entity";
import { CreateTrackContributorDto } from "./dto/create-track-contributor.dto";
import { UpdateTrackContributorDto } from "./dto/update-track-contributor.dto";
import { UUID } from "../../types/common.types";
import { Track, TrackStatus } from "../../entities/track.entity";
import { Contributor } from "../../entities/contributor.entity";
import { ContributorRole } from "../../constants/contributor.constants";
import { CreateBulkTrackContributorsDto } from "./dto/create-bulk-track-contributors.dto";

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

  async createBulk(
    dto: CreateBulkTrackContributorsDto,
    createdById: UUID,
  ): Promise<{
    contributors: TrackContributor[];
    createdRoles: ContributorRole[];
    existingRoles: ContributorRole[];
  }> {
    const roles = [...new Set(dto.roles)];

    return this.trackContributorRepository.manager.transaction(
      async (manager) => {
        const trackRepository = manager.getRepository(Track);
        const contributorRepository = manager.getRepository(Contributor);
        const creditRepository = manager.getRepository(TrackContributor);

        const [track, contributor] = await Promise.all([
          trackRepository.findOne({ where: { id: dto.trackId } }),
          contributorRepository.findOne({ where: { id: dto.contributorId } }),
        ]);

        if (!track) throw new NotFoundException("Track not found");
        if (!contributor) throw new NotFoundException("Contributor not found");

        const existing = await creditRepository.find({
          where: {
            trackId: dto.trackId,
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
                trackId: dto.trackId,
                contributorId: dto.contributorId,
                role,
                createdById,
              })),
            )
            .orIgnore()
            .execute();

          await trackRepository.update(dto.trackId, {
            status: TrackStatus.DRAFT,
          });
        }

        const contributors = await creditRepository.find({
          where: {
            trackId: dto.trackId,
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
  }

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
      sequenceNumber: dto.sequenceNumber,
      createdById,
    });

    const savedTrackContributor =
      await this.trackContributorRepository.save(trackContributor);

    await this.trackRepository.update(dto.trackId, {
      status: TrackStatus.DRAFT,
    });

    return savedTrackContributor;
  }

  async update(
    id: UUID,
    dto: UpdateTrackContributorDto,
  ): Promise<TrackContributor> {
    const trackContributor = await this.trackContributorRepository.findOne({
      where: { id },
    });

    if (!trackContributor) {
      throw new NotFoundException("Track contributor not found");
    }

    if (dto.sequenceNumber !== undefined) {
      trackContributor.sequenceNumber = dto.sequenceNumber;
    }

    const saved = await this.trackContributorRepository.save(trackContributor);

    await this.trackRepository.update(trackContributor.trackId, {
      status: TrackStatus.DRAFT,
    });

    return saved;
  }

  async findByTrackId(trackId: UUID): Promise<TrackContributor[]> {
    const rows = await this.trackContributorRepository.find({
      where: { trackId },
      relations: ["contributor"],
    });
    return sortContributorsForDisplay(rows);
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
