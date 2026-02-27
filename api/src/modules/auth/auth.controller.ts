import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { validateEmail } from '../../helpers/validations.helper';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    const { error } = validateEmail(dto.email);
    if (error) throw new BadRequestException(error.message);

    const userExists = await this.userService.findUserByEmail(dto.email);
    if (userExists) {
      throw new ConflictException({
        message: 'User already exists',
        data: { id: userExists?.id, email: userExists?.email },
      });
    }

    const { user, token } = await this.authService.signup(dto);

    return {
      message: 'You have signed up successfully!',
      data: { user: { ...user, password: undefined }, token },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const { user, token } = await this.authService.login(dto);

    return {
      message: 'You have logged in successfully!',
      data: { user: { ...user, password: undefined }, token },
    };
  }
}
