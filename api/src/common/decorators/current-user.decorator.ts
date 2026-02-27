import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UUID } from '../../types/common.types';

export interface AuthUser {
  id: UUID;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
