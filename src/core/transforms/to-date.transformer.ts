/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export function ToDate() {
  return applyDecorators(
    Transform((v) => {
      if (Number.isNaN(+v.value)) {
        return new Date(v.value);
      }
      return new Date(+v.value);
    }),
  );
}
