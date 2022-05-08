import { Body, Controller, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicEndpoint } from '../../../core/swagger.decorator';
import { UserEntity } from '../../user/entities/user.entity';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { LoginResponseSchema } from '../schemas/login-response.schame';
import { AuthService } from '../services/auth.service';

@ApiTags(AuthController.name)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login to the service with email and password
   */

  @PublicEndpoint(AuthController.name)
  @Post()
  login(@Body() { email, password }: LoginDto): Promise<LoginResponseSchema> {
    return this.authService.login(email, password).then((token) => ({ token }));
  }

  /**
   * Register to the service with email and password
   */

  @PublicEndpoint(AuthController.name)
  @Put()
  register(
    @Body() { email, password, address, city, country, lat, lng, name, phone, state, zip }: RegisterDto,
  ): Promise<UserEntity> {
    return this.authService.register(email, password, address, city, country, lat, lng, name, phone, state, zip);
  }
}
