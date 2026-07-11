import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, ILike, Repository } from "typeorm";
import { Contributor } from "../../entities/contributor.entity";
import { ContributorManager } from "../../entities/contributor-manager.entity";
import { User } from "../../entities/user.entity";
import { EmailService } from "../email/email.service";
import { RejectContributorDto } from "./dto/reject-contributor.dto";
import {
  getPagination,
  getPagingData,
  Pagination,
} from "../../helpers/pagination.helper";
import { UUID } from "../../types/common.types";
import { CreateContributorDto } from "./dto/create-contributor.dto";
import { UpdateContributorDto } from "./dto/update-contributor.dto";
import { ContributorMembership } from "../../entities/contributor-membership.entity";
import { isValidIsni, normalizeIsni } from "../../helpers/releases.helper";
import { ContributorVerificationStatus } from "../../constants/contributor.constants";
import { ContributorAccessService } from "./contributor-access.service";
import { AuthUser } from "../../common/decorators/current-user.decorator";

export type ContributorDetailsResponse = Contributor & {
  managers?: ContributorManager[];
  currentUserIsManager?: boolean;
  currentUserCanManage?: boolean;
};

@Injectable()
export class ContributorService {
  constructor(
    @InjectRepository(Contributor)
    private readonly contributorRepository: Repository<Contributor>,
    @InjectRepository(ContributorMembership)
    private readonly contributorMembershipRepository: Repository<ContributorMembership>,
    @InjectRepository(ContributorManager)
    private readonly managerRepository: Repository<ContributorManager>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly contributorAccess: ContributorAccessService,
  ) {}

  private readonly logger = new Logger(ContributorService.name);

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

  private async assignManagerRow(
    contributorId: UUID,
    userId: UUID,
    assignedById: UUID,
  ): Promise<ContributorManager> {
    const existing = await this.managerRepository.findOne({
      where: { contributorId, userId },
    });
    if (existing) {
      return existing;
    }
    return this.managerRepository.save(
      this.managerRepository.create({
        contributorId,
        userId,
        createdById: assignedById,
      }),
    );
  }

  async create(
    dto: CreateContributorDto,
    createdById: UUID,
  ): Promise<Contributor> {
    if (dto.isni?.trim()) {
      if (!isValidIsni(dto.isni)) {
        throw new BadRequestException("ISNI format is invalid");
      }
      dto.isni = normalizeIsni(dto.isni);
    }
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
      ipn: dto.ipn,
      ipi: dto.ipi,
      isni: dto.isni,
      createdById,
    });

    const savedContributor = await this.contributorRepository.save(contributor);

    // Creator becomes a manager of the new contributor.
    await this.assignManagerRow(savedContributor.id, createdById, createdById);

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
    searchKey,
    searchName,
  }: {
    size?: number;
    page?: number;
    condition?: FindOptionsWhere<Contributor> | FindOptionsWhere<Contributor>[];
    searchKey?: string;
    searchName?: string;
  }): Promise<Pagination> {
    const { take, skip } = getPagination({ size, page });

    let where:
      | FindOptionsWhere<Contributor>
      | FindOptionsWhere<Contributor>[]
      | undefined;

    const normalizedSearchKey = searchKey || searchName;

    if (normalizedSearchKey) {
      const baseCondition =
        (Array.isArray(condition) ? condition[0] : condition) || {};
      where = [
        { ...baseCondition, displayName: ILike(`%${normalizedSearchKey}%`) },
        { ...baseCondition, name: ILike(`%${normalizedSearchKey}%`) },
        { ...baseCondition, email: ILike(`%${normalizedSearchKey}%`) },
        { ...baseCondition, phoneNumber: ILike(`%${normalizedSearchKey}%`) },
        { ...baseCondition, country: ILike(`%${normalizedSearchKey}%`) },
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

  async findOne(
    id: UUID,
    currentUser?: AuthUser,
  ): Promise<ContributorDetailsResponse | null> {
    const contributor = await this.contributorRepository.findOne({
      where: { id },
      relations: {
        parentMemberships: true,
        childMemberships: true,
        managers: { user: true },
      },
    });
    if (!contributor) {
      return null;
    }

    const currentUserIsManager = currentUser?.id
      ? await this.contributorAccess.isAssignedManager(currentUser.id, id)
      : false;
    const currentUserCanManage = await this.contributorAccess.canManage(
      currentUser,
      id,
    );

    return Object.assign(contributor, {
      currentUserIsManager,
      currentUserCanManage,
    });
  }

  async listManagers(contributorId: UUID): Promise<ContributorManager[]> {
    const contributor = await this.contributorRepository.findOne({
      where: { id: contributorId },
      select: ["id"],
    });
    if (!contributor) {
      throw new NotFoundException("Contributor not found");
    }

    return this.managerRepository.find({
      where: { contributorId },
      relations: { user: true },
      order: { createdAt: "DESC" },
    });
  }

  async assignManager(
    contributorId: UUID,
    userId: UUID,
    assignedById: UUID,
  ): Promise<ContributorManager> {
    const contributor = await this.contributorRepository.findOne({
      where: { id: contributorId },
      select: ["id"],
    });
    if (!contributor) {
      throw new NotFoundException("Contributor not found");
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ["id", "name", "email"],
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const existing = await this.managerRepository.findOne({
      where: { contributorId, userId },
    });
    if (existing) {
      throw new ConflictException(
        "User is already a manager of this contributor",
      );
    }

    const saved = await this.managerRepository.save(
      this.managerRepository.create({
        contributorId,
        userId,
        createdById: assignedById,
      }),
    );

    return this.managerRepository.findOneOrFail({
      where: { id: saved.id },
      relations: { user: true },
    });
  }

  async unassignManager(
    contributorId: UUID,
    userId: UUID,
  ): Promise<void> {
    const existing = await this.managerRepository.findOne({
      where: { contributorId, userId },
    });
    if (!existing) {
      throw new NotFoundException("Manager assignment not found");
    }
    await this.managerRepository.remove(existing);
  }

  async update(
    id: UUID,
    dto: UpdateContributorDto,
    lastUpdatedById: UUID,
    actor?: AuthUser,
  ): Promise<Contributor> {
    await this.contributorAccess.assertCanManage(actor, id);

    const contributor = await this.contributorRepository.findOne({
      where: { id },
      relations: { parentMemberships: true, childMemberships: true },
    });
    if (!contributor) {
      throw new NotFoundException("Contributor not found");
    }

    if (dto.isni !== undefined) {
      if (dto.isni?.trim()) {
        if (!isValidIsni(dto.isni)) {
          throw new BadRequestException("ISNI format is invalid");
        }
        dto.isni = normalizeIsni(dto.isni);
      } else {
        dto.isni = undefined;
      }
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
    if (dto.ipn !== undefined) contributor.ipn = dto.ipn;
    if (dto.ipi !== undefined) contributor.ipi = dto.ipi;
    if (dto.isni !== undefined) contributor.isni = dto.isni;

    contributor.lastUpdatedById = lastUpdatedById;

    return this.contributorRepository.save(contributor);
  }

  async remove(id: UUID, actor?: AuthUser): Promise<void> {
    await this.contributorAccess.assertCanManage(actor, id);

    const result = await this.contributorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException("Contributor not found");
    }
  }

  async verify(
    id: UUID,
    verifiedById: UUID,
    actor?: AuthUser,
  ): Promise<Contributor> {
    await this.contributorAccess.assertCanManage(actor, id);

    const contributor = await this.contributorRepository.findOne({
      where: { id },
    });
    if (!contributor) {
      throw new NotFoundException("Contributor not found");
    }
    contributor.verificationStatus = ContributorVerificationStatus.VERIFIED;
    contributor.verifiedById = verifiedById;
    contributor.verifiedAt = new Date();
    contributor.lastUpdatedById = verifiedById;
    const saved = await this.contributorRepository.save(contributor);
    await this.notifyVerificationOutcome(saved, "VERIFIED");
    return saved;
  }

  async reject(
    id: UUID,
    reviewedById: UUID,
    dto?: RejectContributorDto,
    actor?: AuthUser,
  ): Promise<Contributor> {
    await this.contributorAccess.assertCanManage(actor, id);

    const contributor = await this.contributorRepository.findOne({
      where: { id },
    });
    if (!contributor) {
      throw new NotFoundException("Contributor not found");
    }
    contributor.verificationStatus =
      ContributorVerificationStatus.NOT_VERIFIED;
    contributor.verifiedById = reviewedById;
    contributor.verifiedAt = new Date();
    contributor.lastUpdatedById = reviewedById;
    const saved = await this.contributorRepository.save(contributor);
    await this.notifyVerificationOutcome(saved, "REJECTED", dto?.notes);
    return saved;
  }

  private async notifyVerificationOutcome(
    contributor: Contributor,
    outcome: "VERIFIED" | "REJECTED",
    notes?: string,
  ): Promise<void> {
    if (!contributor.email) {
      return;
    }
    try {
      await this.emailService.sendContributorVerificationEmail({
        to: contributor.email,
        contributorName:
          contributor.displayName || contributor.name || "Contributor",
        outcome,
        notes,
        contributorId: contributor.id,
      });
    } catch (error) {
      this.logger.warn(
        `Failed to send contributor verification email for ${contributor.id}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  async requestVerification(
    id: UUID,
    requestedById: UUID,
    actor?: AuthUser,
  ): Promise<Contributor> {
    await this.contributorAccess.assertCanManage(actor, id);

    const contributor = await this.contributorRepository.findOne({
      where: { id },
    });
    if (!contributor) {
      throw new NotFoundException("Contributor not found");
    }
    contributor.verificationStatus =
      ContributorVerificationStatus.PENDING_VERIFICATION;
    contributor.lastUpdatedById = requestedById;

    return this.contributorRepository.save(contributor);
  }
}
