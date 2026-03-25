import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { validateEmail } from '../../helpers/validations.helper';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateUserInvitationDto } from './dto/create-user-invitation.dto';
import { CreateBulkUserInvitationDto } from './dto/create-bulk-user-invitation.dto';
import { ListInvitationsQueryDto } from './dto/list-invitations-query.dto';
import { CompleteUserInvitationDto } from './dto/complete-user-invitation.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { RequestUserInvitationDto } from './dto/request-user-invitation.dto';
import { User } from '../../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const { user, accessToken } = await this.authService.login(dto);
    const { ...userWithoutPassword } = user as unknown as User;

    return {
      message: 'You have logged in successfully!',
      data: { user: userWithoutPassword, accessToken },
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
        status: invitation.status,
      },
    };
  }

  @Post('invitations/request')
  @HttpCode(HttpStatus.OK)
  async requestInvitation(@Body() dto: RequestUserInvitationDto) {
    const { error } = validateEmail(dto.email);
    if (error) throw new BadRequestException(error.message);

    await this.authService.requestInvitation(dto);

    return {
      message:
        'If your request can be approved, you will receive an invitation email shortly.',
    };
  }

  @Post('invitations/bulk')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createBulkInvitations(
    @Body() dto: CreateBulkUserInvitationDto,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.authService.createBulkInvitations(dto.emails, user?.id);
    return {
      message: `${result.succeeded.length} invitation(s) sent successfully.`,
      data: result,
    };
  }

  @Get('invitations')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async listInvitations(@Query() query: ListInvitationsQueryDto) {
    const data = await this.authService.listInvitations({
      page: query.page ?? 0,
      size: query.size ?? 10,
      status: query.status,
    });
    return {
      message: 'Invitations retrieved.',
      data,
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
    const { user, accessToken } = await this.authService.completeInvitation(dto);
    const { ...userWithoutPassword } = user as unknown as User;

    return {
      message: 'Your account has been created successfully!',
      data: { user: userWithoutPassword, accessToken },
    };
  }

  @Post('invitations/:id/revoke')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async revokeInvitation(@Param('id') id: string) {
    const invitation = await this.authService.revokeInvitation(id);
    return {
      message: 'Invitation revoked.',
      data: { id: invitation.id, email: invitation.email, status: invitation.status },
    };
  }

  @Post('invitations/:id/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async approveInvitation(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    const invitation = await this.authService.approveInvitation(id, user?.id);

    return {
      message: 'Invitation approved and email sent.',
      data: {
        id: invitation.id,
        email: invitation.email,
        expiresAt: invitation.expiresAt,
        status: invitation.status,
      },
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
