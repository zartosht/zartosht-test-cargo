/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { applyDecorators, SetMetadata, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserJwtAuthGuard } from '../modules/auth/guards/user.guard';

export function PublicEndpoint(controller: string, version = '') {
  return applyDecorators(Version(version), SetMetadata('auth', false), ApiTags(`${controller}, Public`, 'Public'));
}

export function UserEndpoint(controller: string, version = '') {
  return applyDecorators(
    Version(version),
    ApiBearerAuth(),
    UseGuards(UserJwtAuthGuard),
    ApiTags(`${controller}, User`, 'User'),
  );
}
