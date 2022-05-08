import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, FindManyOptions, FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { ItemEntity } from '../entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly storagesRepository: Repository<ItemEntity>,
  ) {}

  find(input: FindManyOptions<ItemEntity>): Promise<ItemEntity[]> {
    return this.storagesRepository.find(input);
  }

  findOne(input: FindOneOptions<ItemEntity>): Promise<ItemEntity | undefined> {
    return this.storagesRepository.findOne(input);
  }

  findOneOrFail(input: FindOneOptions<ItemEntity>): Promise<ItemEntity> {
    return this.storagesRepository.findOneOrFail(input);
  }

  save(input: Partial<ItemEntity>): Promise<ItemEntity> {
    return this.storagesRepository.save(new ItemEntity(input));
  }

  update(find: FindConditions<ItemEntity>, update: Partial<ItemEntity>): Promise<UpdateResult> {
    return this.storagesRepository.update(find, update);
  }
}
