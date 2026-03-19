import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contributor } from '../../entities/contributor.entity';
import { getPagination, getPagingData, Pagination } from '../../helpers/pagination.helper';
import { UUID } from '../../types/common.types';
import { CreateContributorDto } from './dto/create-contributor.dto';
import { UpdateContributorDto } from './dto/update-contributor.dto';

@Injectable()
export class ContributorService {
  constructor(
    @InjectRepository(Contributor)
    private readonly contributorRepository: Repository<Contributor>,
  ) {}

  async create(dto: CreateContributorDto, createdById: UUID): Promise<Contributor> {
    const contributor = this.contributorRepository.create({
      name: dto.name,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      country: dto.country,
      gender: dto.gender,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      displayName: dto.displayName,
      profileLinks: dto.profileLinks,
      status: dto.status,
      verificationStatus: dto.verificationStatus,
      createdById,
    });
    return this.contributorRepository.save(contributor);
  }

  async findAll({
    size,
    page,
    condition,
  }: {
    size?: number;
    page?: number;
    condition?: object;
  }): Promise<Pagination> {
    const { take, skip } = getPagination({ size, page });
    const data = await this.contributorRepository.findAndCount({
      where: condition,
      take,
      skip,
      order: { createdAt: 'DESC' },
    });
    return getPagingData({ data, size, page });
  }

  async findOne(id: UUID): Promise<Contributor | null> {
    return this.contributorRepository.findOne({ where: { id } });
  }

  async update(id: UUID, dto: UpdateContributorDto): Promise<Contributor> {
    const contributor = await this.contributorRepository.findOne({ where: { id } });
    if (!contributor) {
      throw new NotFoundException('Contributor not found');
    }

    if (dto.name !== undefined) contributor.name = dto.name;
    if (dto.email !== undefined) contributor.email = dto.email;
    if (dto.phoneNumber !== undefined) contributor.phoneNumber = dto.phoneNumber;
    if (dto.country !== undefined) contributor.country = dto.country;
    if (dto.gender !== undefined) contributor.gender = dto.gender;
    if (dto.dateOfBirth !== undefined) {
      contributor.dateOfBirth = dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined;
    }
    if (dto.displayName !== undefined) contributor.displayName = dto.displayName;
    if (dto.profileLinks !== undefined) contributor.profileLinks = dto.profileLinks;
    if (dto.status !== undefined) contributor.status = dto.status;
    if (dto.verificationStatus !== undefined) {
      contributor.verificationStatus = dto.verificationStatus;
    }

    return this.contributorRepository.save(contributor);
  }

  async remove(id: UUID): Promise<void> {
    const result = await this.contributorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Contributor not found');
    }
  }
}
