import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class PaginationNoOrderDto {
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

  @IsOptional()
  @IsString()
  search?: string;
}
