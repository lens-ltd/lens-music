import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { validateEmail } from '../../helpers/validations.helper';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('signup')
  async signup(
    @Body()
    body: {
      email: string;
      name: string;
      phone: string;
      password: string;
      role: string;
    }
  ) {
    const { email, name, phone, password, role } = body;

    if (!email || !name || !password) {
      throw new BadRequestException('Email, name, and password are required');
    }

    const { error } = validateEmail(email);
    if (error) {
      throw new BadRequestException(error.message);
    }

    const userExists = await this.userService.findUserByEmail(email);
    if (userExists) {
      throw new ConflictException({
        message: 'User already exists',
        data: { id: userExists.id, email: userExists.email },
      });
    }

    const newUser = await this.authService.signup({
      email,
      name,
      phone,
      password,
      role,
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    return {
      message: 'You have signed up successfully!',
      data: { user: { ...newUser, password: undefined }, token },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    const user = await this.authService.login({ email, password });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1w' }
    );

    return {
      message: 'You have logged in successfully!',
      data: { user: { ...user, password: undefined }, token },
    };
  }
}
