import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../modules/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SystemUserSeeder {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seed(): Promise<string> {
    const systemUser = await this.userRepository.findOne({
      where: { email: 'system@taskmate.com' },
    });

    if (systemUser) {
      return systemUser.id;
    }

    const hashedPassword = await bcrypt.hash('system123', 10);
    const newSystemUser = this.userRepository.create({
      email: 'system@taskmate.com',
      fullName: 'System User',
      password: hashedPassword,
      isEmailVerified: true,
      active_status: true,
      del_status: false,
    });

    await this.userRepository.save(newSystemUser);
    return newSystemUser.id;
  }
} 