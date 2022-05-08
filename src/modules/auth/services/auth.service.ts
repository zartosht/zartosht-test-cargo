import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { instanceToPlain } from 'class-transformer';
import { UserEntity } from '../../user/entities/user.entity';
import { UsersService } from '../../user/services/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async login(email: string, password: string): Promise<string> {
    const user = await this.usersService.findOne({
      where: { email },
    });

    if (!user) {
      // I personally usually don't like to tell the user that the email not exists
      // for some security reasons
      throw new HttpException('Username or Password is incorrect.', 403);
    }

    if (!compareSync(password, user.password)) {
      throw new HttpException('Username or Password is incorrect.', 403);
    }

    return this.jwtService.sign({ ...instanceToPlain({ id: user.id }) });
  }

  register(
    email: string,
    password: string,
    address: string,
    city: string,
    country: string,
    lat: number,
    lng: number,
    name: string,
    phone: string,
    state: string,
    zip: string,
  ): Promise<UserEntity> {
    return this.usersService.save({
      email,
      password,
      address,
      city,
      country,
      lat,
      lng,
      name,
      phone,
      state,
      zip,
    });
  }
}
