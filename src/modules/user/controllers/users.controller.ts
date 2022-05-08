import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEndpoint } from '../../../core/swagger.decorator';
import { IReq } from '../../auth/interfaces/request.interface';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserEntity } from '../entities/user.entity';

@ApiTags(UsersController.name)
@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersService: Repository<UserEntity>,
  ) {}

  /**
   * It won't look again in database bcs it already fetched user from
   * DB in the guard
   *
   * @returns Get requested user profile
   */

  @Get('profile')
  @UserEndpoint(UsersController.name)
  getUserProfile(@Req() { user }: IReq): UserEntity {
    return user;
  }

  /**
   * Update a user profile
   *
   * @returns updated user profile
   */

  @Patch('profile')
  @UserEndpoint(UsersController.name)
  updateUserProfile(@Req() { user }: IReq, @Body() input: UpdateUserDto): Promise<UserEntity> {
    return this.usersService
      .update(user.id, input)
      .then(() => this.usersService.findOneOrFail({ where: { id: user.id } }));
  }
}
