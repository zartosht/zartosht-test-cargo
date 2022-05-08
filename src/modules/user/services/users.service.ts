import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, FindManyOptions, FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  find(input: FindManyOptions<UserEntity>): Promise<UserEntity[]> {
    return this.userRepository.find(input);
  }

  findOne(input: FindOneOptions<UserEntity>): Promise<UserEntity | undefined> {
    return this.userRepository.findOne(input);
  }

  findOneOrFail(input: FindOneOptions<UserEntity>): Promise<UserEntity> {
    return this.userRepository.findOneOrFail(input);
  }

  save(input: Partial<UserEntity>): Promise<UserEntity> {
    return this.userRepository.save(new UserEntity(input));
  }

  update(find: FindConditions<UserEntity>, update: Partial<UserEntity>): Promise<UpdateResult> {
    return this.userRepository.update(find, update);
  }

  /**
   * Charge the user for the requested store request
   *
   * @param _id user ud
   * @param amount amount to be charged from the user credit card
   * @returns amount
   */

  chargeUser(_id: number, amount: number): Promise<number> {
    // charge user credit cart with the requested amount goes here!!!
    // and probably store balance history for user
    // or send some notifications or invoices
    if (Math.random() > 0.5) return Promise.resolve(amount);

    throw new Error('Not enough funds');
  }
}
