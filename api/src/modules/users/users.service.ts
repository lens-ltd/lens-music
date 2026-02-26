import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UUID } from '../../types/common.types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // GET USER BY EMAIL
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('password')
      .getOne();
  }

  // GET USER BY ID
  async findUserById(id: UUID): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // DELETE USER
  async deleteUser(id: UUID): Promise<User | null> {
    const userExists = await this.userRepository.findOne({ where: { id } });
    if (!userExists) return null;
    return this.userRepository.remove(userExists);
  }
}
