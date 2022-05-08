import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class StorageExistsDto {
  @IsNotEmpty()
  @Transform((v) => +v.value)
  @IsNumber({ allowNaN: false })
  id!: number;
}
