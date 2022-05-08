import { Transform } from 'class-transformer';
import { IsOptional, IsNumber } from 'class-validator';

export class PaginationNoOrderNoSearchDto {
  @IsOptional()
  @Transform((v) => Math.abs(+v.value))
  @IsNumber({
    allowNaN: false,
  })
  skip?: number;

  @IsOptional()
  @Transform((v) => Math.abs(+v.value))
  @IsNumber({
    allowNaN: false,
  })
  limit?: number;
}
