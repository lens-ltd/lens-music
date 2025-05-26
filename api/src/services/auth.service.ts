import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import { comparePasswords, hashPassword } from '../helpers/encryptions.helper';
import { ValidationError } from '../helpers/errors.helper';

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

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
    phone: string;
    password: string;
    role: string;
  }): Promise<User> {
    try {
      if (!email) {
        throw new Error('Email is required');
      }
      if (!name) {
        throw new Error('Name is required');
      }
      if (!password) {
        throw new Error('Password is required');
      }

      const hashedPassword = await hashPassword(password);

      const newUser = this.userRepository.create({
        email,
        name,
        phone,
        password: hashedPassword,
        role,
      });

      return this.userRepository.save(newUser);
    } catch (error: any) {
      throw error;
    }
  }

  // LOGIN
  async login({ email, password }: { email: string; password: string }): Promise<User> {
    if (!email) {
      throw new ValidationError('Email is required');
    }
    if (!password) {
      throw new ValidationError('Password is required');
    }

    const userExists = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name'],
    });

    if (!userExists) {
      throw new ValidationError('Email or password is incorrect');
    }

    const isPasswordMatch = await comparePasswords(
      password,
      userExists.password
    );

    if (!isPasswordMatch) {
      throw new ValidationError('Email or password is incorrect');
    }

    return userExists;
  }
}
