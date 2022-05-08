import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { SortEnum } from './enums/sort.enum';

export class PaginationDto {
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
  @IsEnum(SortEnum)
  sort?: SortEnum;

  @IsOptional()
  @IsString()
  search?: string;
}
