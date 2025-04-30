import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { User } from './modules/users/entities/user.entity';
import { Category } from './modules/categories/entities/category.entity';
import { Priority } from './modules/priorities/entities/priority.entity';
import { Todo } from './modules/todos/entities/todo.entity';
import { AuthModule } from './modules/auth/auth.module';
import { PrioritiesModule } from './modules/priorities/priorities.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TodosModule } from './modules/todos/todos.module';
import { CliModule } from './shared/commands/command.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [User, Category, Priority, Todo],
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    PrioritiesModule,
    CategoriesModule,
    TodosModule,
    CliModule,
  ],
})
export class AppModule {}
