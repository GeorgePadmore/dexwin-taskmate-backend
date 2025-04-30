import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('priorities')
export class Priority extends BaseEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ default: true })
  active_status: boolean;

  @Column({ default: false })
  del_status: boolean;
}
