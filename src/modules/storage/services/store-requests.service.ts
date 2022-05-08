import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, FindManyOptions, FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { StoreRequestEntity } from '../entities/store-request.entity';

@Injectable()
export class StoreRequestsService {
  constructor(
    @InjectRepository(StoreRequestEntity)
    private readonly storagesRepository: Repository<StoreRequestEntity>,
  ) {}

  find(input: FindManyOptions<StoreRequestEntity>): Promise<StoreRequestEntity[]> {
    return this.storagesRepository.find(input);
  }

  findOne(input: FindOneOptions<StoreRequestEntity>): Promise<StoreRequestEntity | undefined> {
    return this.storagesRepository.findOne(input);
  }

  findOneOrFail(input: FindOneOptions<StoreRequestEntity>): Promise<StoreRequestEntity> {
    return this.storagesRepository.findOneOrFail(input);
  }

  save(input: Partial<StoreRequestEntity>): Promise<StoreRequestEntity> {
    return this.storagesRepository.save(new StoreRequestEntity(input));
  }

  update(find: FindConditions<StoreRequestEntity>, update: Partial<StoreRequestEntity>): Promise<UpdateResult> {
    return this.storagesRepository.update(find, update);
  }
}
