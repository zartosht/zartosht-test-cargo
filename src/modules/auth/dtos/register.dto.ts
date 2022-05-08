import { Transform } from 'class-transformer';
import { IsEmail, IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform((v) => v.value.toLowerCase())
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(new RegExp(/\d{11}/), {
    message: 'Phone number must be 11 digits',
  })
  phone!: string;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  state!: string;

  @IsNotEmpty()
  @IsString()
  zip!: string;

  @IsNotEmpty()
  @IsString()
  country!: string;

  @IsNotEmpty()
  @Transform((v) => +v.value)
  @IsNumber({ allowNaN: false })
  @IsLatitude()
  lat!: number;

  @IsNotEmpty()
  @Transform((v) => +v.value)
  @IsNumber({ allowNaN: false })
  @IsLongitude()
  lng!: number;
}
