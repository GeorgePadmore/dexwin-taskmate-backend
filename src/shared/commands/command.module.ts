import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { SeedCommand } from './seed.command';
import { SeederModule } from '../services/seeders/seeder.module';

@Module({
  imports: [CommandModule, SeederModule],
  providers: [SeedCommand],
  exports: [SeedCommand],
})
export class CliModule {}
