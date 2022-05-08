import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../core/entities.entity';
import { ItemEntity } from './item.entity';

@Entity({
  name: 'storages',
})
export class StorageEntity extends BaseEntity<StorageEntity> {
  @Column({ name: 'name', type: 'varchar', nullable: false })
  name!: string | null;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description!: string | null;

  @Column({ name: 'type', type: 'varchar', nullable: false })
  type!: string | null;

  @Column({ name: 'address', type: 'varchar', nullable: true })
  address!: string | null;

  @Column({ name: 'city', type: 'varchar', nullable: true })
  city!: string | null;

  @Column({ name: 'state', type: 'varchar', nullable: true })
  state!: string | null;

  @Column({ name: 'zip', type: 'varchar', nullable: true })
  zip!: string | null;

  @Column({ name: 'country', type: 'varchar', nullable: true })
  country!: string | null;

  @Column({ name: 'lat', type: 'float', nullable: true })
  lat!: number | null;

  @Column({ name: 'lng', type: 'float', nullable: true })
  lng!: number | null;

  @Column({
    name: 'max_weight',
    type: 'float',
    nullable: false,
    comment: 'Maximum weight that is acceptable by this storage',
  })
  maxWeight!: number;

  @Column({
    name: 'max_width',
    type: 'float',
    nullable: false,
    comment: 'Maximum width that is acceptable by this storage',
  })
  maxWidth!: number;

  @Column({
    name: 'max_height',
    type: 'float',
    nullable: false,
    comment: 'Maximum height that is acceptable by this storage',
  })
  maxHeight!: number;

  @OneToMany(() => ItemEntity, (item) => item.storage)
  items!: ItemEntity[];
}
