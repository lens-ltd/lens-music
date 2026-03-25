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
}
