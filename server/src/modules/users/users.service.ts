import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'
import * as path from 'path';
import * as fs from 'fs';

import { User } from '@/database/entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    findByEmail(email: string) {
        return this.userRepository.findOne({ where: { email } })
    }

    async findOneByParams(params: FindOptionsWhere<User>) {
        const user = await this.userRepository.findOne({ where: params });
        if (!user) {
            throw new NotFoundException('User not found')
        }
        const { password, ...safeUser } = user;

        return safeUser
    }

    create(data: Partial<User>) {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }

    async updateAvatar(userId: number, filename: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new Error('User not found');
      
        if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
          const oldPath = path.join(process.cwd(), user.avatar);
          try {
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          } catch (err) {
            console.warn(`⚠️ Не удалось удалить старый аватар: ${err.message}`);
          }
        }

        user.avatar = `/uploads/avatars/${filename}`;
        await this.userRepository.save(user);
      
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
}