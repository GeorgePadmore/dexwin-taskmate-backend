import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Category } from '../../categories/entities/category.entity';
import { Priority } from '../../priorities/entities/priority.entity';
import { User } from '../../users/entities/user.entity';

@Entity('todos')
export class Todo extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @ManyToOne(() => Priority, { onDelete: 'SET NULL' })
  priority: Priority;

  @Column({ nullable: true })
  priorityId: string;

  @ManyToOne(() => Category, { onDelete: 'SET NULL' })
  category: Category;

  @Column({ nullable: true })
  categoryId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @Column({ default: 'A' })
  status: string;

  @Column({ default: true })
  active_status: boolean;

  @Column({ default: false })
  del_status: boolean;
}
