import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform((v) => v.value.toLowerCase())
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
