import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Label } from '../../entities/label.entity';
import { getPagination, getPagingData } from '../../helpers/pagination.helper';
import { UserService } from '../users/users.service';
import { UUID } from '../../types/common.types';
import { LabelPagination } from '../../types/models/label.types';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
    private readonly userService: UserService,
  ) {}

  // CREATE LABEL
  async createLabel({
    name,
    email,
    description,
    userId,
    country,
  }: {
    name: string;
    email?: string;
    description?: string;
    userId: UUID;
    country?: string;
  }): Promise<Label> {
    const userExists = await this.userService.findUserById(userId);
    if (!userExists) throw new Error('User not found');

    const newLabel = this.labelRepository.create({
      name,
      email,
      description,
      userId,
      country: country?.toUpperCase(),
    });

    return this.labelRepository.save(newLabel);
  }

  // FETCH LABELS
  async fetchLabels({
    condition,
    size,
    page,
  }: {
    condition?: object;
    size: number;
    page: number;
  }): Promise<LabelPagination> {
    const { take, skip } = getPagination({ size, page });
    const labels = await this.labelRepository.findAndCount({
      where: condition,
      relations: ['user'],
      take,
      skip,
    });
    return getPagingData({ data: labels, size, page });
  }

  // GET LABEL BY ID
  async getLabelById(id: UUID): Promise<Label | null> {
    return this.labelRepository.findOne({ where: { id }, relations: ['user'] });
  }

  // UPDATE LABEL
  async updateLabel({
    id,
    name,
    email,
    description,
    country,
  }: {
    id: UUID;
    name?: string;
    email?: string;
    description?: string;
    country?: string;
  }): Promise<Label | null> {
    const labelExists = await this.labelRepository.findOne({ where: { id } });
    if (!labelExists) return null;

    labelExists.name = name || labelExists.name;
    labelExists.email = email || labelExists.email;
    labelExists.description = description || labelExists.description;
    labelExists.country = country?.toUpperCase() || labelExists.country;

    return this.labelRepository.save(labelExists);
  }

  // DELETE LABEL
  async deleteLabel(id: string): Promise<DeleteResult> {
    return this.labelRepository.delete(id);
  }
}
