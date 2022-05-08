import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UsersService } from '../../user/services/users.service';
import { StoreRequestStatusEnum } from '../enums/store-request-status.enum';
import { ItemsService } from '../services/items.service';
import { StoreRequestsService } from '../services/store-requests.service';

@Processor('storeRequests')
export class StoreRequestsProcessor {
  constructor(
    private readonly storeRequestsService: StoreRequestsService,
    private readonly itemsService: ItemsService,
    private readonly usersService: UsersService,
  ) {}

  @Process()
  async activityProccess({ data }: Job<number>): Promise<number> {
    const { user, storage, item } = await this.storeRequestsService.findOneOrFail({
      where: {
        id: data,
      },
      relations: ['user', 'storage', 'storage.items', 'item'],
    });

    // we have to have a better logic to calculate remained storage place, but
    // for the sake of this demo we try to think that our storage is like fluid :D
    const usedWidthStorage = storage.items
      .filter((i) => i.isActive)
      .map((i) => +i.width)
      .reduce((a, b) => a + b, 0);
    const usedHeightStorage = storage.items
      .filter((i) => i.isActive)
      .map((i) => +i.height)
      .reduce((a, b) => a + b, 0);
    const usedWeightStorage = storage.items
      .filter((i) => i.isActive)
      .map((i) => +i.weight!)
      .reduce((a, b) => a + b, 0);

    const availableWidthStorage = +storage.maxWidth - usedWidthStorage - item!.width;
    const availableHeightStorage = +storage.maxHeight - usedHeightStorage - item!.height;
    const availableWeightStorage = +storage.maxWeight - usedWeightStorage - item!.weight;

    if (availableHeightStorage <= 0 || availableWeightStorage <= 0 || availableWidthStorage <= 0) {
      await this.storeRequestsService.update(
        { id: data },
        { status: StoreRequestStatusEnum.FAILED, description: `Not enough space on the requested storage!` },
      );
    } else {
      try {
        // first try to charge user
        await this.usersService.chargeUser(user.id, 10 /* amount */);

        // if the charge process goes well, we continue
        await Promise.resolve([
          this.storeRequestsService.update({ id: data }, { status: StoreRequestStatusEnum.DONE }),
          this.itemsService.update({ id: data }, { isActive: true }),
          // send some notifications here
        ]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        // for when user credit card rejects the payment
        await this.storeRequestsService.update(
          { id: data },
          { status: StoreRequestStatusEnum.FAILED, description: e.message },
        );
      }
    }

    return data;
  }
}
