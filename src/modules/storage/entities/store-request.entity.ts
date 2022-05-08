import { Transform } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entities.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { StoreRequestStatusEnum } from '../enums/store-request-status.enum';
import { ItemEntity } from './item.entity';
import { StorageEntity } from './storage.entity';

@Entity({
  name: 'store_requests',
})
export class StoreRequestEntity extends BaseEntity<StoreRequestEntity> {
  @Column({ type: 'text', name: 'description', nullable: true })
  description!: string | null;

  @Column({ nullable: true })
  user_id!: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user!: UserEntity;

  @Column({ nullable: true })
  storage_id!: number;

  @ManyToOne(() => StorageEntity)
  @JoinColumn({
    name: 'storage_id',
    referencedColumnName: 'id',
  })
  storage!: StorageEntity;

  @Column({ nullable: true })
  item_id!: number;

  @ManyToOne(() => ItemEntity, { nullable: true })
  @JoinColumn({
    name: 'item_id',
    referencedColumnName: 'id',
  })
  item!: ItemEntity | null;

  @Transform((v) => StoreRequestStatusEnum[v.value])
  @Column({ type: 'bigint', name: 'status', default: StoreRequestStatusEnum.PENDING })
  status!: StoreRequestStatusEnum;
}
