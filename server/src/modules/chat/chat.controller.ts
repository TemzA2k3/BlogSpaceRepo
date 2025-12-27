import {
    Controller,
    Post,
    UseGuards,
    Body,
    BadRequestException,
    Get,
    Param,
    Query,
    Delete,
    HttpCode
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
    getAllUserChats(@UserReq() user: JwtPayload) {
        return this.chatService.getAllUserChats(user.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    async deleteChat(
        @Param('id') id: string,
        @UserReq() user: JwtPayload
    ) {
        await this.chatService.deleteChat(+id, user.userId);
    }

    @Get('/:chat_id/messages')
    @UseGuards(JwtAuthGuard)
    getChatMessages(
      @Param('chat_id') chatId: string,
      @Query('offset') offset = 0,
      @Query('limit') limit = 30,
      @UserReq() user: JwtPayload
    ) {
      return this.chatService.getChatMessages(
        +chatId,
        user.userId,
        +offset,
        +limit
      );
    }
    
}
