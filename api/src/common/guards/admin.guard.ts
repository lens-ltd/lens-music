import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as { email?: string } | undefined;
    const adminEmail = process.env.ADMIN_EMAIL || 'info@lens.rw';

    if (!user?.email || user.email !== adminEmail) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
