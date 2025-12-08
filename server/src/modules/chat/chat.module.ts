import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';

import { Message } from '@/database/entities/message.entity';
import { Chat } from '@/database/entities/chat.entity';

import { JwtSharedModule } from '@/common/jwt/jwt.module';
import { User } from '@/database/entities/user.entity';
import { UsersModule } from '../users/users.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([Chat, Message, User]),
        JwtSharedModule,
        UsersModule
    ],
    providers: [ChatService, ChatGateway],
    controllers: [ChatController]
})
export class ChatModule { }
