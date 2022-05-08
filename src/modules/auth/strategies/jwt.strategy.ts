import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { configService } from 'core/config.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from '../../user/entities/user.entity';
import { UsersService } from '../../user/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getJwtSecret(),
    });
  }

  async validate(payload: UserEntity): Promise<UserEntity> {
    if (!payload.id) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findOne({
      where: {
        id: payload.id,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
