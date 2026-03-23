import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UUID } from '../../types/common.types';
import { getPagingData, getPagination, Pagination } from '../../helpers/pagination.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async findUserById(id: UUID): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async listUsers({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<Pagination> {
    const { take, skip } = getPagination({ page, size });
    const data = await this.userRepository.findAndCount({
      select: [
        'id',
        'name',
        'email',
        'phoneNumber',
        'status',
        'createdAt',
        'updatedAt',
        'createdById',
      ],
      order: { createdAt: 'DESC' },
      take,
      skip,
    });

    return getPagingData({ data, page, size });
  }

  async createUser({
    email,
    name,
    phoneNumber,
    password,
  }: {
    email: string;
    name: string;
    phoneNumber?: string;
    password: string;
  }): Promise<User> {
    const user = this.userRepository.create({
      email,
      name,
      phoneNumber,
      password,
    });

    return this.userRepository.save(user);
  }

  async updatePassword(id: UUID, password: string): Promise<void> {
    await this.userRepository.update(id, { password });
  }

  async deleteUser(id: UUID): Promise<User | null> {
    const userExists = await this.userRepository.findOne({ where: { id } });
    if (!userExists) return null;
    return this.userRepository.remove(userExists);
  }
}
