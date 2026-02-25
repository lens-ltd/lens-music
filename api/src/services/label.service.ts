import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Label } from '../entities/label.entity';
import { getPagination, getPagingData } from '../helpers/pagination.helper';
import { UserService } from './user.service';
import { UUID } from '../types/common.types';
import { LabelPagination } from '../types/models/label.types';

@Injectable()
export class LabelService {
  private labelRepository: Repository<Label>;
  private userService = new UserService();

  constructor() {
    this.labelRepository = AppDataSource.getRepository(Label);
  }

  // CREATE LABEL
  async createLabel({
    name,
    email,
    description,
    userId,
    country,
  }: {
    name: string;
    email: string;
    description: string;
    userId: UUID;
    country: string;
  }): Promise<Label> {
    try {
      if (!name) {
        throw new Error('Name is required');
      }

      if (!userId) {
        throw new Error('User ID is required');
      }

      // CHECK IF USER EXISTS
      const userExists = await this.userService.findUserById(userId);

      // IF USER NOT FOUND
      if (!userExists) {
        throw new Error('User not found');
      }

      const newLabel = this.labelRepository.create({
        name,
        email,
        description,
        userId,
        country: country.toUpperCase(),
      });

      return this.labelRepository.save(newLabel);
    } catch (error: any) {
      throw error;
    }
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

    try {
      const labels = await this.labelRepository.findAndCount({
        where: condition,
        relations: ['user'],
        take,
        skip,
      });
      return getPagingData({ data: labels, size, page });
    } catch (error: any) {
      throw error;
    }
  }

  // GET LABEL BY ID
  async getLabelById(id: UUID): Promise<Label | null> {
    try {
      // IF ID IS NOT PROVIDED
      if (!id) {
        throw new Error('Label ID is required');
      }

      // FIND LABEL BY ID
      const label = await this.labelRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      // IF LABEL NOT FOUND
      if (!label) {
        return null;
      }

      return label;
    } catch (error: any) {
      throw error;
    }
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
    name: string;
    email: string;
    description: string;
    country: string;
  }): Promise<Label | null> {
    try {
      // IF ID IS NOT PROVIDED
      if (!id) {
        throw new Error('Label ID is required');
      }

      // FIND LABEL BY ID
      const labelExists = await this.labelRepository.findOne({ where: { id } });

      // IF LABEL NOT FOUND
      if (!labelExists) {
        return null;
      }

      // UPDATE LABEL
      labelExists.name = name || labelExists.name;
      labelExists.email = email || labelExists.email;
      labelExists.description = description || labelExists.description;
      labelExists.country = country.toUpperCase() || labelExists.country;

      return this.labelRepository.save(labelExists);
    } catch (error: any) {
      throw error;
    }
  }

  // DELETE LABEL
  async deleteLabel(id: string): Promise<DeleteResult | null> {
    try {
      // IF ID IS NOT PROVIDED
      if (!id) {
        throw new Error('Label ID is required');
      }

      // DELETE LABEL
      return await this.labelRepository.delete(id);
    } catch (error: any) {
      throw error;
    }
  }
}
