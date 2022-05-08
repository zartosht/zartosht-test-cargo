import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoragesController } from './controllers/storages.controller';
import { ItemEntity } from './entities/item.entity';
import { StorageEntity } from './entities/storage.entity';
import { StoreRequestEntity } from './entities/store-request.entity';
import { ItemsService } from './services/items.service';
import { StoreRequestsService } from './services/store-requests.service';
import { StoragesService } from './services/storages.service';
import { StoreRequestsProcessor } from './processors/store-requests.processor';
import { UserModule } from 'modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StorageEntity, ItemEntity, StoreRequestEntity]),
    BullModule.registerQueue({
      name: 'storeRequests',
    }),
    UserModule,
  ],
  controllers: [StoragesController],
  providers: [StoragesService, ItemsService, StoreRequestsService, StoreRequestsProcessor],
  exports: [StoragesService, ItemsService, StoreRequestsService],
})
export class StorageModule {}
