// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { Reflector } from '@nestjs/core';
// import { Request } from 'express';
// import { Observable } from 'rxjs';
// import { Role } from 'src/auth/auth.model';
// import { IS_PUBLIC_KEY, ROLES_KEY } from '../decorators/admin.decorator';

// @Injectable()
// export class ApiKeyGuard implements CanActivate {
//   constructor(
//     private readonly reflector: Reflector,
//     private readonly configService: ConfigService,
//   ) {}
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     // const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
//     // if (isPublic) {
//     //   return true;
//     // }

//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (!requiredRoles) {
//       return true;
//     }

//     const { user } = context.switchToHttp().getRequest();
//     console.log(user);

//     return requiredRoles.some((role) => user.role?.includes(role));

//     // const request = context.switchToHttp().getRequest<Request>();
//     // const authHeader = request.header('Authorization');

//     // console.log('ApiKeyGuard');
//     // console.log(request.user);
//     // return authHeader === this.configService.get('API_KEY');
//   }
// }
