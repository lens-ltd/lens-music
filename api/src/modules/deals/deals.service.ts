import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Deal } from "../../entities/deal.entity";
import { Release } from "../../entities/release.entity";
import { Store } from "../../entities/store.entity";
import { CreateDealDto } from "./dto/create-deal.dto";
import { UpdateDealDto } from "./dto/update-deal.dto";
import { UUID } from "../../types/common.types";
import { ReleaseStatus } from "../../constants/release.constants";
import { isValidIso3166Alpha2 } from "../../helpers/releases.helper";

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,
    @InjectRepository(Release)
    private readonly releaseRepository: Repository<Release>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create(
    releaseId: UUID,
    dto: CreateDealDto,
    createdById: UUID,
  ): Promise<Deal> {
    const release = await this.releaseRepository.findOne({
      where: { id: releaseId },
    });

    if (!release) {
      throw new NotFoundException("Release not found");
    }

    if (dto.storeId) {
      const store = await this.storeRepository.findOne({
        where: { id: dto.storeId },
      });
      if (!store) {
        throw new NotFoundException("Store not found");
      }
    }

    if (dto.territories.length === 0) {
      throw new BadRequestException("At least one territory is required");
    }
    this.ensureIsoTerritories(dto.territories, dto.excludedTerritories);

    if (dto.endDate && dto.startDate) {
      if (new Date(dto.endDate) <= new Date(dto.startDate)) {
        throw new BadRequestException("End date must be after start date");
      }
    }

    if (dto.priceAmount && !dto.priceCurrency) {
      throw new BadRequestException(
        "Price currency is required when price amount is set",
      );
    }

    await this.assertNoOverlappingDeals(releaseId, dto);

    const deal = this.dealRepository.create({
      releaseId,
      storeId: dto.storeId || undefined,
      commercialModelType: dto.commercialModelType,
      useType: dto.useType,
      territories: dto.territories,
      excludedTerritories: dto.excludedTerritories || [],
      startDate: dto.startDate,
      endDate: dto.endDate || undefined,
      preorderDate: dto.preorderDate || undefined,
      priceType: dto.priceType || undefined,
      priceAmount: dto.priceAmount || undefined,
      priceCurrency: dto.priceCurrency?.toUpperCase() || undefined,
      takedownDate: dto.takedownDate || undefined,
      takedownReason: dto.takedownReason?.trim() || undefined,
      isActive: dto.isActive ?? true,
      createdById,
    });

    const saved = await this.dealRepository.save(deal);
    await this.resetValidatedReleaseToDraft(releaseId);

    return this.dealRepository.findOneOrFail({
      where: { id: saved.id },
      relations: ["store"],
    });
  }

  async findByReleaseId(releaseId: UUID): Promise<Deal[]> {
    return this.dealRepository.find({
      where: { releaseId },
      relations: ["store"],
      order: { createdAt: "ASC" },
    });
  }

  async update(
    releaseId: UUID,
    dealId: UUID,
    dto: UpdateDealDto,
  ): Promise<Deal> {
    const deal = await this.dealRepository.findOne({
      where: { id: dealId, releaseId },
    });

    if (!deal) {
      throw new NotFoundException("Deal not found");
    }

    if (dto.storeId !== undefined) {
      if (dto.storeId) {
        const store = await this.storeRepository.findOne({
          where: { id: dto.storeId },
        });
        if (!store) {
          throw new NotFoundException("Store not found");
        }
      }
      deal.storeId = dto.storeId || undefined;
    }

    if (dto.territories !== undefined) {
      if (dto.territories.length === 0) {
        throw new BadRequestException("At least one territory is required");
      }
      deal.territories = dto.territories;
    }

    this.ensureIsoTerritories(
      dto.territories ?? deal.territories,
      dto.excludedTerritories ?? deal.excludedTerritories,
    );

    const startDate = dto.startDate ?? deal.startDate;
    const endDate = dto.endDate ?? deal.endDate;
    if (endDate && startDate) {
      if (new Date(endDate) <= new Date(startDate)) {
        throw new BadRequestException("End date must be after start date");
      }
    }

    if (dto.commercialModelType !== undefined) deal.commercialModelType = dto.commercialModelType;
    if (dto.useType !== undefined) deal.useType = dto.useType;
    if (dto.excludedTerritories !== undefined) deal.excludedTerritories = dto.excludedTerritories;
    if (dto.startDate !== undefined) deal.startDate = dto.startDate;
    if (dto.endDate !== undefined) deal.endDate = dto.endDate || undefined;
    if (dto.preorderDate !== undefined) deal.preorderDate = dto.preorderDate || undefined;
    if (dto.priceType !== undefined) deal.priceType = dto.priceType || undefined;
    if (dto.priceAmount !== undefined) deal.priceAmount = dto.priceAmount || undefined;
    if (dto.priceCurrency !== undefined) deal.priceCurrency = dto.priceCurrency?.toUpperCase() || undefined;
    if (dto.takedownDate !== undefined) deal.takedownDate = dto.takedownDate || undefined;
    if (dto.takedownReason !== undefined) deal.takedownReason = dto.takedownReason?.trim() || undefined;
    if (dto.isActive !== undefined) deal.isActive = dto.isActive;

    await this.assertNoOverlappingDeals(
      releaseId,
      {
        storeId: deal.storeId,
        commercialModelType: deal.commercialModelType,
        useType: deal.useType,
        territories: deal.territories,
        excludedTerritories: deal.excludedTerritories,
        startDate: deal.startDate,
        endDate: deal.endDate,
      },
      deal.id,
    );

    const saved = await this.dealRepository.save(deal);
    await this.resetValidatedReleaseToDraft(releaseId);

    return this.dealRepository.findOneOrFail({
      where: { id: saved.id },
      relations: ["store"],
    });
  }

  async delete(releaseId: UUID, dealId: UUID): Promise<void> {
    const deal = await this.dealRepository.findOne({
      where: { id: dealId, releaseId },
    });

    if (!deal) {
      throw new NotFoundException("Deal not found");
    }

    await this.dealRepository.delete(dealId);
    await this.resetValidatedReleaseToDraft(releaseId);
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

  private ensureIsoTerritories(territories: string[], excludedTerritories?: string[]) {
    const all = [...territories, ...(excludedTerritories ?? [])];
    for (const territory of all) {
      if (!isValidIso3166Alpha2(territory)) {
        throw new BadRequestException(`Invalid territory code: ${territory}`);
      }
    }
  }

  private parseDateOrMax(value?: string): number {
    return value ? new Date(value).getTime() : Number.POSITIVE_INFINITY;
  }

  private rangesOverlap(aStart: string, aEnd: string | undefined, bStart: string, bEnd: string | undefined): boolean {
    const aStartTime = new Date(aStart).getTime();
    const aEndTime = this.parseDateOrMax(aEnd);
    const bStartTime = new Date(bStart).getTime();
    const bEndTime = this.parseDateOrMax(bEnd);
    return aStartTime <= bEndTime && bStartTime <= aEndTime;
  }

  private territoriesOverlap(
    aTerritories: string[],
    aExcluded: string[] | undefined,
    bTerritories: string[],
    bExcluded: string[] | undefined,
  ): boolean {
    const aExcludedSet = new Set((aExcluded ?? []).map((t) => t.toUpperCase()));
    const bExcludedSet = new Set((bExcluded ?? []).map((t) => t.toUpperCase()));
    const aIncluded = new Set(aTerritories.map((t) => t.toUpperCase()).filter((t) => !aExcludedSet.has(t)));
    const bIncluded = new Set(bTerritories.map((t) => t.toUpperCase()).filter((t) => !bExcludedSet.has(t)));
    for (const territory of aIncluded) {
      if (bIncluded.has(territory)) {
        return true;
      }
    }
    return false;
  }

  private storeScopeOverlaps(aStoreId?: UUID, bStoreId?: UUID): boolean {
    return !aStoreId || !bStoreId || aStoreId === bStoreId;
  }

  private async assertNoOverlappingDeals(
    releaseId: UUID,
    candidate: Pick<
      Deal,
      "storeId" | "commercialModelType" | "useType" | "territories" | "excludedTerritories" | "startDate" | "endDate"
    >,
    currentDealId?: UUID,
  ): Promise<void> {
    const existingDeals = await this.dealRepository.find({
      where: { releaseId, isActive: true },
    });

    const hasConflict = existingDeals.some((deal) => {
      if (currentDealId && deal.id === currentDealId) {
        return false;
      }
      if (deal.commercialModelType !== candidate.commercialModelType || deal.useType !== candidate.useType) {
        return false;
      }
      if (!this.storeScopeOverlaps(deal.storeId, candidate.storeId)) {
        return false;
      }
      if (!this.rangesOverlap(deal.startDate, deal.endDate, candidate.startDate, candidate.endDate)) {
        return false;
      }
      return this.territoriesOverlap(
        deal.territories,
        deal.excludedTerritories,
        candidate.territories,
        candidate.excludedTerritories,
      );
    });

    if (hasConflict) {
      throw new ConflictException("Overlapping deals are not allowed for the same scope");
    }
  }
}
