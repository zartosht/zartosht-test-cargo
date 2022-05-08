import { hashSync } from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../core/entities.entity';
import { ItemEntity } from '../../storage/entities/item.entity';

@Entity({
  name: 'users',
})
export class UserEntity extends BaseEntity<UserEntity> {
  @Column({ name: 'name', type: 'varchar', nullable: false })
  name!: string;

  @Column({ name: 'email', type: 'varchar', nullable: false })
  email!: string;

  @Exclude({ toPlainOnly: true })
  @Column({ name: 'password', type: 'varchar', nullable: false })
  password!: string;

  @Column({ name: 'phone', type: 'varchar', nullable: true })
  phone!: string | null;

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

  @OneToMany(() => ItemEntity, (item) => item.user)
  items!: ItemEntity[];

  @BeforeInsert()
  beforeInsert(): void {
    this.hashPassword();
  }

  @BeforeUpdate()
  beforeUpdate(): void {
    this.hashPassword();
  }

  private hashPassword(): void {
    if (this.password) {
      this.password = hashSync(this.password, 10);
    }
  }
}
