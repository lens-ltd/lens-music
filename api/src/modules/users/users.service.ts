import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Label } from '../../entities/label.entity';
import { Release } from '../../entities/release.entity';
import { UUID } from '../../types/common.types';
import { getPagingData, getPagination, Pagination } from '../../helpers/pagination.helper';

/** User payload for detail views (no password; includes role + workspace). */
export type UserDetailsResponse = Omit<User, 'password' | 'assignedRole'> & {
  permissions: string[];
  roleName?: string;
  labels: Label[];
  releases: Release[];
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
    @InjectRepository(Release)
    private readonly releaseRepository: Repository<Release>,
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

  /**
   * Load a user for the details page: identity fields, role/permissions,
   * and labels/releases created by this user (createdById proxy).
   */
  async getUserDetails(id: UUID): Promise<UserDetailsResponse | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.assignedRole', 'role')
      .leftJoinAndSelect('role.permissions', 'rolePermission')
      .leftJoinAndSelect('rolePermission.permission', 'permission')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      return null;
    }

    const [labels, releases] = await Promise.all([
      this.labelRepository.find({
        where: { createdById: id },
        select: ['id', 'name', 'email', 'description', 'country', 'createdAt', 'updatedAt'],
        order: { createdAt: 'DESC' },
      }),
      this.releaseRepository.find({
        where: { createdById: id },
        select: [
          'id',
          'title',
          'version',
          'status',
          'upc',
          'coverArtUrl',
          'createdAt',
          'updatedAt',
        ],
        order: { createdAt: 'DESC' },
      }),
    ]);

    const permissions =
      user.assignedRole?.permissions
        ?.map((rp) => rp.permission?.name)
        .filter((name): name is string => Boolean(name)) ?? [];
    const roleName = user.assignedRole?.name;
    const { password: _password, assignedRole: _assignedRole, ...rest } = user;

    return {
      ...rest,
      permissions,
      roleName,
      labels,
      releases,
    };
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
