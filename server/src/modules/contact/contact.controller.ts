import { Controller, Post, Body, HttpCode } from '@nestjs/common';

import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dtos/create-contact-message.dto';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) {}

    @Post()
    @HttpCode(201)
    async create(@Body() dto: CreateContactMessageDto) {
        await this.contactService.create(dto);
        return { success: true };
    }
}