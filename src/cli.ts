import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CliModule } from './shared/commands/command.module';
import { CommandService } from 'nestjs-command';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const commandService = app.select(CliModule).get(CommandService);
  await commandService.exec();
  await app.close();
}

bootstrap();
