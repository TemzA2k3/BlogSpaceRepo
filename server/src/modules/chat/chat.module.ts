import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';

import { Message } from '@/database/entities/message.entity';
import { Chat } from '@/database/entities/chat.entity';

import { JwtSharedModule } from '@/common/jwt/jwt.module';
import { User } from '@/database/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat, Message, User]),
        JwtSharedModule
    ],
    providers: [ChatService, ChatGateway],
    controllers: [ChatController]
})
export class ChatModule { }
