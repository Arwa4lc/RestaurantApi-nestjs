import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Role } from 'src/auth/auth.model';

// export const IS_PUBLIC_KEY = 'isPublic';
// export const ROLES_KEY = 'roles';

// export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
// export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();

  if (req.user.role === 'admin') {
    return true;
  }

  throw new ForbiddenException('Only admins allowed..');
});
