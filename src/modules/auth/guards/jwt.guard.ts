/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const authFlag = this.reflector.get<boolean>('auth', context.getHandler());
    return authFlag === false ? true : super.canActivate(context);
  }

  handleRequest(err: any, user: any, _: any, __: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
