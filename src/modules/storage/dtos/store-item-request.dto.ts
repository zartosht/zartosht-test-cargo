import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StoreItemRequestDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  type!: string;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsNotEmpty()
  @Transform((v) => +v.value)
  @IsNumber({ allowNaN: false })
  weight!: number;

  @IsNotEmpty()
  @Transform((v) => +v.value)
  @IsNumber({ allowNaN: false })
  width!: number;

  @IsNotEmpty()
  @Transform((v) => +v.value)
  @IsNumber({ allowNaN: false })
  height!: number;
}
