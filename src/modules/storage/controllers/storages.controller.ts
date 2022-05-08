import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';
import { PublicEndpoint, UserEndpoint } from '../../../core/swagger.decorator';
import { IReq } from '../../auth/interfaces/request.interface';
import { StorageExistsDto } from '../dtos/storage-exists.dto';
import { StoreItemRequestDto } from '../dtos/store-item-request.dto';
import { StorageEntity } from '../entities/storage.entity';
import { StoreRequestEntity } from '../entities/store-request.entity';
import { ItemsService } from '../services/items.service';
import { StoragesService } from '../services/storages.service';
import { StoreRequestsService } from '../services/store-requests.service';
import chance from 'chance';

@ApiTags(StoragesController.name)
@Controller('storages')
export class StoragesController {
  constructor(
    @InjectQueue('storeRequests')
    private readonly storeRequestQueue: Queue,

    private readonly storagesService: StoragesService,
    private readonly itemsService: ItemsService,
    private readonly storeRequestService: StoreRequestsService,
  ) {}

  @Get('store/:id')
  @UserEndpoint(StoragesController.name)
  indexRequests(@Req() { user }: IReq, @Param() { id }: StorageExistsDto): Promise<StoreRequestEntity[]> {
    return this.storeRequestService.find({ where: { user_id: user.id, storage_id: id } });
  }

  @Post('store/:id')
  @UserEndpoint(StoragesController.name)
  requestStoreItem(
    @Req() { user }: IReq,
    @Param() { id }: StorageExistsDto,
    @Body() { address, description, height, name, type, weight, width }: StoreItemRequestDto,
  ): Promise<StoreRequestEntity> {
    // create an inactive item
    return (
      this.itemsService
        .save({
          address,
          description,
          height,
          name,
          type,
          weight,
          width,
          storage_id: id,
          isActive: false,
        })
        // create a request for the created inactive item
        .then((item) =>
          this.storeRequestService.save({
            item_id: item.id,
            storage_id: id,
            user_id: user.id,
          }),
        )
        // queue request tobe processed
        .then((request) => {
          this.storeRequestQueue.add(request.id);
          return request;
        })
    );
  }

  // it is actually an admin endpoint
  // and have to have a guard or role checker
  // as metadatas and etc...
  @PublicEndpoint(StoragesController.name)
  @Post()
  createStorage(): Promise<StorageEntity> {
    const randomGenerator = new chance();
    return this.storagesService.save({
      address: randomGenerator.address(),
      description: randomGenerator.sentence(),
      maxHeight: randomGenerator.integer({ min: 100, max: 300 }),
      maxWidth: randomGenerator.integer({ min: 100, max: 300 }),
      maxWeight: randomGenerator.integer({ min: 100, max: 300 }),
      name: randomGenerator.word(),
      type: randomGenerator.word(),
      city: randomGenerator.city(),
      state: randomGenerator.state(),
      country: randomGenerator.country(),
      lat: randomGenerator.latitude(),
      lng: randomGenerator.longitude(),
      zip: randomGenerator.zip(),
    });
  }

  @PublicEndpoint(StoragesController.name)
  @Get()
  indexStorages(): Promise<StorageEntity[]> {
    return this.storagesService.find({});
  }

  @PublicEndpoint(StoragesController.name)
  @Get(':id')
  getStorage(@Param() { id }: StorageExistsDto): Promise<StorageEntity> {
    return this.storagesService.findOneOrFail({ where: { id } });
  }
}
