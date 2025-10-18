import { Injectable } from '@nestjs/common';
import { Repository, FindOptionsWhere } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'

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

    findOneByParams(params: FindOptionsWhere<User>) {
        return this.userRepository.findOne({ where: params });
    }

    create(data: Partial<User>) {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }
}