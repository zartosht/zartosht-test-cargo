/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export function ToBoolean() {
  return applyDecorators(
    Transform(({ value }) => (value ? ['t', 'true', '1'].includes(value.toString().toLowerCase()) : value)),
  );
}
