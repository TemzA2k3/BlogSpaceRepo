import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContactMessage } from '@/database/entities/contact-message.entity';
import { CreateContactMessageDto } from './dtos/create-contact-message.dto';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(ContactMessage)
        private readonly contactMessageRepository: Repository<ContactMessage>,
    ) {}

    async create(dto: CreateContactMessageDto): Promise<void> {
        const message = this.contactMessageRepository.create(dto);
        await this.contactMessageRepository.save(message);
    }

    async findAll(): Promise<ContactMessage[]> {
        return this.contactMessageRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<ContactMessage | null> {
        return this.contactMessageRepository.findOne({ where: { id } });
    }
}