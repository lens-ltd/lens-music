import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { comparePasswords, hashPassword } from '../../helpers/encryptions.helper';
import { ConflictError, ValidationError } from '../../helpers/errors.helper';
import { UserStatus } from '../../constants/user.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  // SIGNUP
  async signup({
    email,
    name,
    phone,
    password,
    role,
  }: {
    email: string;
    name: string;
    phone?: string;
    password: string;
    role?: string;
  }): Promise<{ user: User; token: string }> {

    // CHECK IF USER EXISTS
    const userExists: User | null = await this.userRepository.findOne({ where: { email } });
    // CHECK IF USER STATUS IS ACTIVE
    if (userExists?.status !== UserStatus.ACTIVE) throw new ValidationError('User is not active', 'AUTH SERVICE');

    if (userExists) throw new ConflictError('User already exists', { id: userExists.id, email: userExists.email }, 'AUTH SERVICE');
    const hashedPassword = await hashPassword(password);

    const newUser = await this.userRepository.save(
      this.userRepository.create({ email, name, phone, password: hashedPassword }),
    );

    const token = this.jwtService.sign(
      { id: newUser.id, email: newUser.email },
      { expiresIn: '1d' },
    );

    return { user: newUser, token };
  }

  // LOGIN
  async login({ email, password }: { email: string; password: string }): Promise<{ user: User; token: string }> {
    if (!email) throw new ValidationError('Email is required', 'AUTH SERVICE');
    if (!password) throw new ValidationError('Password is required', 'AUTH SERVICE');

    const userExists = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name'],
    });

    if (!userExists) throw new ValidationError('Email or password is incorrect', 'AUTH SERVICE');

    const isPasswordMatch = await comparePasswords(password, userExists.password);
    if (!isPasswordMatch) throw new ValidationError('Email or password is incorrect', 'AUTH SERVICE');

    const token = this.jwtService.sign(
      { id: userExists.id, email: userExists.email },
      { expiresIn: '1w' },
    );

    return { user: userExists, token };
  }
}
