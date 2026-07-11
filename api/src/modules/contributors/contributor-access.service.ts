import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContributorManager } from '../../entities/contributor-manager.entity';
import { PERMISSIONS } from '../../constants/permission.constants';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { UUID } from '../../types/common.types';

/**
 * Enforces per-contributor manager assignment on top of role permissions.
 * Admins with ASSIGN_CONTRIBUTOR_MANAGER bypass the assignment table.
 */
@Injectable()
export class ContributorAccessService {
  constructor(
    @InjectRepository(ContributorManager)
    private readonly managerRepository: Repository<ContributorManager>,
  ) {}

  hasAssignPermission(user?: AuthUser | null): boolean {
    return Boolean(
      user?.permissions?.includes(PERMISSIONS.ASSIGN_CONTRIBUTOR_MANAGER),
    );
  }

  async isAssignedManager(
    userId: UUID,
    contributorId: UUID,
  ): Promise<boolean> {
    const row = await this.managerRepository.findOne({
      where: { userId, contributorId },
      select: ['id'],
    });
    return Boolean(row);
  }

  async canManage(
    user: AuthUser | undefined,
    contributorId: UUID,
  ): Promise<boolean> {
    if (!user?.id) {
      return false;
    }
    if (this.hasAssignPermission(user)) {
      return true;
    }
    return this.isAssignedManager(user.id, contributorId);
  }

  async assertCanManage(
    user: AuthUser | undefined,
    contributorId: UUID,
  ): Promise<void> {
    const allowed = await this.canManage(user, contributorId);
    if (!allowed) {
      throw new ForbiddenException(
        'You must be assigned as a manager of this contributor to perform this action',
      );
    }
  }
}
