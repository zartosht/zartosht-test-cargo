import { Transform } from 'class-transformer';
import { IsLatitude, IsLongitude, IsOptional, IsNumber, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  @Matches(new RegExp(/\d{11}/), {
    message: 'Phone number must be 11 digits',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zip?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @Transform((v) => +v.value)
  @IsNumber({ allowNaN: false })
  @IsLatitude()
  lat?: number;

  @IsOptional()
  @Transform((v) => +v.value)
  @IsNumber({ allowNaN: false })
  @IsLongitude()
  lng?: number;
}
