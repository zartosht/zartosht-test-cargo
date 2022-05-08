import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, FindManyOptions, FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { StorageEntity } from '../entities/storage.entity';

@Injectable()
export class StoragesService {
  constructor(
    @InjectRepository(StorageEntity)
    private readonly storagesRepository: Repository<StorageEntity>,
  ) {}

  find(input: FindManyOptions<StorageEntity>): Promise<StorageEntity[]> {
    return this.storagesRepository.find(input);
  }

  findOne(input: FindOneOptions<StorageEntity>): Promise<StorageEntity | undefined> {
    return this.storagesRepository.findOne(input);
  }

  findOneOrFail(input: FindOneOptions<StorageEntity>): Promise<StorageEntity> {
    return this.storagesRepository.findOneOrFail(input);
  }

  save(input: Partial<StorageEntity>): Promise<StorageEntity> {
    return this.storagesRepository.save(new StorageEntity(input));
  }

  update(find: FindConditions<StorageEntity>, update: Partial<StorageEntity>): Promise<UpdateResult> {
    return this.storagesRepository.update(find, update);
  }
}
