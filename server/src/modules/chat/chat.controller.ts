import {
    Controller,
    Post,
    UseGuards,
    Body,
    BadRequestException,
    Get
} from '@nestjs/common';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { type JwtPayload } from '@/shared/types/jwt-payload.interface';

import { UserReq } from '@/common/decorators/user.decorator';

import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    createChat(
        @Body('targetUserId') targetUserId: number,
        @UserReq() user: JwtPayload
    ) {
        if (!targetUserId) {
            throw new BadRequestException('targetUserId is required!');
        }

        return this.chatService.createChat(user.userId, targetUserId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllUserChats(@UserReq() user: JwtPayload) {
        return this.chatService.getAllUserChats(user.userId);
    }
}
