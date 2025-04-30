import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Category } from '../../categories/entities/category.entity';
import { Todo } from '../../todos/entities/todo.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ nullable: true })
  emailVerificationTokenExpiry: Date;

  @Column({ default: true })
  active_status: boolean;

  @Column({ default: false })
  del_status: boolean;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
