import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { User } from '../../entities/user.entity';
import { comparePasswords, hashPassword } from '../../helpers/encryptions.helper';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../../helpers/errors.helper';
import { UserStatus } from '../../constants/user.constants';
import { InvitationStatus } from '../../constants/invitation.constants';
import { UserInvitation } from '../../entities/user-invitation.entity';
import { PasswordResetToken } from '../../entities/password-reset-token.entity';
import { UserService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { getPagination, getPagingData, Pagination } from '../../helpers/pagination.helper';

/** User fields returned to the client (includes role permissions from seeds, e.g. SUPER_ADMIN). */
export type AuthResponseUser = Omit<User, 'password' | 'assignedRole'> & {
  permissions: string[];
  roleName?: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserInvitation)
    private readonly userInvitationRepository: Repository<UserInvitation>,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetRepository: Repository<PasswordResetToken>,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  private signToken(user: Pick<User, 'id' | 'email'>): string {
    return this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: '1w' },
    );
  }

  private createToken(): string {
    return randomBytes(32).toString('hex');
  }

  private getAppUrl(): string {
    return process.env.APP_URL || 'http://localhost:5173';
  }

  private getInvitationExpiryDays(): number {
    return Number(process.env.INVITATION_EXPIRES_IN_DAYS || 7);
  }

  private getPasswordResetExpiryMinutes(): number {
    return Number(process.env.PASSWORD_RESET_EXPIRES_IN_MINUTES || 60);
  }

  private ensureFutureDate(date: Date, message: string) {
    if (date.getTime() < Date.now()) {
      throw new ValidationError(message, 'AUTH SERVICE');
    }
  }

  private validatePassword(password: string): void {
    if (!password || password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters', 'AUTH SERVICE');
    }
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  private collectPermissionNames(user: User): string[] {
    return (
      user.assignedRole?.permissions
        ?.map((rp) => rp.permission?.name)
        .filter((name): name is string => Boolean(name)) ?? []
    );
  }

  private toPublicAuthUser(user: User): AuthResponseUser {
    const permissions = this.collectPermissionNames(user);
    const roleName = user.assignedRole?.name;
    const { password: _password, assignedRole: _assignedRole, ...rest } = user;
    return { ...rest, permissions, roleName };
  }

  private async loadUserWithRoleForAuth(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.assignedRole', 'role')
      .leftJoinAndSelect('role.permissions', 'rolePermission')
      .leftJoinAndSelect('rolePermission.permission', 'permission')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ user: AuthResponseUser; accessToken: string }> {
    if (!email) throw new ValidationError('Email is required', 'AUTH SERVICE');
    if (!password) {
      throw new ValidationError('Password is required', 'AUTH SERVICE');
    }

    const userExists = await this.loadUserWithRoleForAuth(email);

    if (!userExists || !userExists.password) {
      throw new ValidationError('Email or password is incorrect', 'AUTH SERVICE');
    }

    if (userExists.status !== UserStatus.ACTIVE) {
      throw new ValidationError('Your account is not active yet', 'AUTH SERVICE');
    }

    const isPasswordMatch = await comparePasswords(password, userExists.password);
    if (!isPasswordMatch) {
      throw new ValidationError('Email or password is incorrect', 'AUTH SERVICE');
    }

    const accessToken = this.signToken(userExists);
    return { user: this.toPublicAuthUser(userExists), accessToken };
  }

  async createInvitation(email: string, createdById?: string) {
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError('User already exists', { email }, 'AUTH SERVICE');
    }

    const token = this.createToken();
    const expiresInDays = this.getInvitationExpiryDays();
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

    const existingInvitation = await this.userInvitationRepository.findOne({
      where: { email },
    });

    const invitation = existingInvitation
      ? await this.userInvitationRepository.save({
          ...existingInvitation,
          token,
          expiresAt,
          status: InvitationStatus.PENDING,
          completedAt: null,
          createdById: createdById || existingInvitation.createdById,
        })
      : await this.userInvitationRepository.save(
          this.userInvitationRepository.create({
            email,
            token,
            expiresAt,
            status: InvitationStatus.PENDING,
            completedAt: null,
            createdById,
          }),
        );

    try {
      await this.emailService.sendInvitationEmail({
        to: email,
        invitationUrl: `${this.getAppUrl()}/auth/invitation/${token}`,
        expiresInDays,
      });
    } catch (error) {
      await this.userInvitationRepository.save({
        ...invitation,
        status: InvitationStatus.FAILED,
      });
      throw new BadGatewayException(
        this.getErrorMessage(error) || 'Failed to send invitation email',
      );
    }

    return invitation;
  }

  async createBulkInvitations(
    emails: string[],
    createdById?: string,
  ): Promise<{ succeeded: string[]; failed: { email: string; reason: string }[] }> {
    const succeeded: string[] = [];
    const failed: { email: string; reason: string }[] = [];

    for (const email of emails) {
      try {
        await this.createInvitation(email, createdById);
        succeeded.push(email);
      } catch (error) {
        failed.push({ email, reason: this.getErrorMessage(error) });
      }
    }

    return { succeeded, failed };
  }

  async listInvitations({
    page,
    size,
    status,
  }: {
    page: number;
    size: number;
    status?: InvitationStatus;
  }): Promise<Pagination> {
    const { take, skip } = getPagination({ size, page });
    const where = status ? { status } : {};
    const data = await this.userInvitationRepository.findAndCount({
      select: [
        'id',
        'email',
        'expiresAt',
        'status',
        'completedAt',
        'createdAt',
        'updatedAt',
        'createdById',
      ],
      where,
      order: { createdAt: 'DESC' },
      take,
      skip,
    });
    return getPagingData({ data, size, page });
  }

  async revokeInvitation(id: string): Promise<UserInvitation> {
    const invitation = await this.userInvitationRepository.findOne({ where: { id } });
    if (!invitation) throw new NotFoundError('Invitation not found', 'AUTH SERVICE');
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new ValidationError('Only pending invitations can be revoked', 'AUTH SERVICE');
    }
    invitation.status = InvitationStatus.REVOKED;
    return this.userInvitationRepository.save(invitation);
  }

  async getInvitationByToken(token: string): Promise<UserInvitation> {
    const invitation = await this.userInvitationRepository.findOne({ where: { token } });

    if (!invitation) {
      throw new NotFoundError('Invitation not found', 'AUTH SERVICE');
    }

    this.ensureFutureDate(invitation.expiresAt, 'Invitation has expired');

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new ValidationError('This invitation is no longer valid', 'AUTH SERVICE');
    }

    return invitation;
  }

  async completeInvitation({
    token,
    name,
    phoneNumber,
    password,
  }: {
    token: string;
    name: string;
    phoneNumber?: string;
    password: string;
  }): Promise<{ user: AuthResponseUser; accessToken: string }> {
    this.validatePassword(password);

    const invitation = await this.getInvitationByToken(token);

    const existingUser = await this.userService.findUserByEmail(invitation.email);
    if (existingUser) {
      await this.userInvitationRepository.delete({ email: invitation.email });
      throw new ConflictError('User already exists', { email: invitation.email }, 'AUTH SERVICE');
    }

    const hashedPassword = await hashPassword(password);
    const user = await this.userService.createUser({
      email: invitation.email,
      name,
      phoneNumber,
      password: hashedPassword,
    });

    invitation.status = InvitationStatus.COMPLETED;
    invitation.completedAt = new Date();
    await this.userInvitationRepository.save(invitation);

    const userWithRole =
      (await this.loadUserWithRoleForAuth(user.email!)) ?? user;

    return {
      user: this.toPublicAuthUser(userWithRole),
      accessToken: this.signToken(user),
    };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const expiresInMinutes = this.getPasswordResetExpiryMinutes();
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      return;
    }

    const token = this.createToken();
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    const existingResetToken = await this.passwordResetRepository.findOne({
      where: { userId: user.id },
    });

    if (existingResetToken) {
      await this.passwordResetRepository.save({
        ...existingResetToken,
        token,
        expiresAt,
      });
    } else {
      await this.passwordResetRepository.save(
        this.passwordResetRepository.create({
          userId: user.id,
          token,
          expiresAt,
        }),
      );
    }

    await this.emailService.sendPasswordResetEmail({
      to: email,
      resetUrl: `${this.getAppUrl()}/auth/reset-password/${token}`,
      expiresInMinutes,
    });
  }

  async getPasswordResetByToken(token: string): Promise<PasswordResetToken> {
    const passwordReset = await this.passwordResetRepository.findOne({ where: { token } });

    if (!passwordReset) {
      throw new NotFoundError('Password reset request not found', 'AUTH SERVICE');
    }

    this.ensureFutureDate(passwordReset.expiresAt, 'Password reset link has expired');
    return passwordReset;
  }

  async confirmPasswordReset({
    token,
    password,
  }: {
    token: string;
    password: string;
  }): Promise<void> {
    this.validatePassword(password);

    const resetRequest = await this.getPasswordResetByToken(token);
    const hashedPassword = await hashPassword(password);

    await this.userService.updatePassword(resetRequest.userId, hashedPassword);
    await this.passwordResetRepository.delete({ userId: resetRequest.userId });
  }
}
