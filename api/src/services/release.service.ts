import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Release } from "../entities/release.entity";
import { getPagination, getPagingData } from "../helpers/pagination.helper";
import { UUID } from "crypto";
import { ReleasePagination } from "../types/models/release.types";

export class ReleaseService {
    private releaseRepository: Repository<Release>;

    constructor() {
        this.releaseRepository = AppDataSource.getRepository(Release);
    }

    // CREATE RELEASE
    async createRelease({
        title,
        upc,
        releaseDate,
        version,
        productionYear,
        catalogNumber,
        labelId,
        userId,
    }: {
        title: string;
        upc: string;
        releaseDate: string;
        version: string;
        productionYear: number;
        catalogNumber: string;
        labelId: UUID;
        userId: UUID;
    }): Promise<Release> {
        try {
            if (!title) {
                throw new Error("Title is required");
            }

            if (!releaseDate) {
                throw new Error("Release date is required");
            }

            if (!productionYear) {
                throw new Error("Production year is required");
            }

            if (!userId) {
                throw new Error("User ID is required");
            }

            const newRelease = this.releaseRepository.create({
                title,
                upc,
                releaseDate,
                version,
                productionYear,
                catalogNumber,
                labelId,
                userId,
            });

            return this.releaseRepository.save(newRelease);
        } catch (error: any) {
            throw error;
        }
    }

    // FETCH RELEASES
    async fetchReleases({
        size,
        page,
        condition,
    }: {
        size: number;
        page: number;
        condition: object;
    }): Promise<ReleasePagination> {

        const { take, skip } = getPagination({ page, size });

        try {
          const releases = await this.releaseRepository.findAndCount({
            take,
            skip,
            order: {
              updatedAt: 'DESC',
            },
            relations: ['label', 'user'],
            where: condition,
          });

          return getPagingData({ data: releases, size, page });
        } catch (error: any) {
          throw error;
        }
    }

    // CHECK LABEL DUPLICATION
    async checkIfLabelExists({
        labelId,
        userId,
        version,
        productionYear,
        title,
        releaseDate
    }: {
        labelId: UUID;
        userId: UUID;
        version?: string;
        productionYear: number;
        title: string;
        releaseDate: string;
    }): Promise<Release | null> {
        try {
            const labelExists = await this.releaseRepository.findOne({
                where: {
                    labelId,
                    userId,
                    version,
                    productionYear,
                    title,
                    releaseDate,
                },
            });

            return labelExists;
        } catch (error: any) {
            throw error;
        }
    }

    // GET RELEASE BY ID
    async getReleaseById(id: UUID): Promise<Release | null> {
        try {
            return this.releaseRepository.findOne({
              where: { id },
              relations: ['label', 'user'],
            });
        } catch (error: any) {
            throw error;
        }
    }

    // UPDATE RELEASE
    async updateRelease({
        id,
        title,
        upc,
        releaseDate,
        version,
        productionYear,
        labelId,
    }: {
        id: UUID;
        title: string;
        upc: string;
        releaseDate: string;
        version: string;
        productionYear: number;
        labelId: UUID;
    }): Promise<Release> {
        try {
            const updatedRelease = await this.releaseRepository.update(id, {
                title,
                upc,
                releaseDate,
                version,
                productionYear,
                labelId,
            })

            return updatedRelease.raw;
        } catch (error: any) {
            throw error;
        }
    }
}
