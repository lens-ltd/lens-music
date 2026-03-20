import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { validateEmail } from '../../helpers/validations.helper';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateUserInvitationDto } from './dto/create-user-invitation.dto';
import { CompleteUserInvitationDto } from './dto/complete-user-invitation.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const { user, token } = await this.authService.login(dto);

    return {
      message: 'You have logged in successfully!',
      data: { user: { ...user, password: undefined }, token },
    };
  }

  @Post('invitations')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createInvitation(
    @Body() dto: CreateUserInvitationDto,
    @CurrentUser() user: { id: string },
  ) {
    const { error } = validateEmail(dto.email);
    if (error) throw new BadRequestException(error.message);

    const invitation = await this.authService.createInvitation(dto.email, user?.id);

    return {
      message: 'Invitation created successfully.',
      data: {
        id: invitation.id,
        email: invitation.email,
        expiresAt: invitation.expiresAt,
      },
    };
  }

  @Get('invitations/:token')
  async getInvitation(@Param('token') token: string) {
    const invitation = await this.authService.getInvitationByToken(token);

    return {
      message: 'Invitation is valid.',
      data: {
        email: invitation.email,
        expiresAt: invitation.expiresAt,
      },
    };
  }

  @Post('invitations/complete')
  @HttpCode(HttpStatus.OK)
  async completeInvitation(@Body() dto: CompleteUserInvitationDto) {
    const { user, token } = await this.authService.completeInvitation(dto);

    return {
      message: 'Your account has been created successfully!',
      data: { user: { ...user, password: undefined }, token },
    };
  }

  @Post('password-reset/request')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    await this.authService.requestPasswordReset(dto.email);

    return {
      message:
        'If an account exists for that email, a password reset link has been sent.',
    };
  }

  @Get('password-reset/:token')
  async getPasswordReset(@Param('token') token: string) {
    const resetRequest = await this.authService.getPasswordResetByToken(token);

    return {
      message: 'Password reset token is valid.',
      data: {
        expiresAt: resetRequest.expiresAt,
      },
    };
  }

  @Post('password-reset/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmPasswordReset(@Body() dto: ConfirmPasswordResetDto) {
    await this.authService.confirmPasswordReset(dto);

    return {
      message: 'Your password has been reset successfully.',
    };
  }
}
