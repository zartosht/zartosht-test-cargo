import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entities.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { StorageEntity } from './storage.entity';

@Entity({
  name: 'items',
})
export class ItemEntity extends BaseEntity<ItemEntity> {
  @Column({ name: 'name', type: 'varchar', nullable: false })
  name!: string | null;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description!: string | null;

  @Column({ name: 'type', type: 'varchar', nullable: false })
  type!: string | null;

  @Column({ name: 'address', type: 'varchar', nullable: false })
  address!: string | null;

  @Column({ name: 'weight', type: 'float', nullable: false })
  weight!: number;

  @Column({ name: 'width', type: 'float', nullable: false })
  width!: number;

  @Column({ name: 'height', type: 'float', nullable: false })
  height!: number;

  @Column({ name: 'is_active', default: false })
  isActive!: boolean;

  @Column({ nullable: true })
  user_id!: number | null;

  @ManyToOne(() => UserEntity, (user) => user.items)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user!: UserEntity;

  @Column({ nullable: true })
  storage_id!: number | null;

  @ManyToOne(() => StorageEntity, (storage) => storage.items)
  @JoinColumn({
    name: 'storage_id',
    referencedColumnName: 'id',
  })
  storage!: StorageEntity;
}
