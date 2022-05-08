/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEnumWithMessage } from '../decorators';

export function StringToEnum(numberEnum: any) {
  return applyDecorators(
    Transform((v) => {
      const tierStrings = Object.keys(numberEnum).filter((i) => Number.isNaN(+i));
      return tierStrings.indexOf(v.value);
    }),
    IsEnumWithMessage(numberEnum),
  );
}
