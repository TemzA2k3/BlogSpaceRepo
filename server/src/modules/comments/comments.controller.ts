import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';
import { CommentsService } from './comments.service';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { UserReq } from '@/common/decorators/user.decorator';

import { CreateUserDto } from './dtos/create-comment.dto'

import type { JwtPayload } from '@/shared/types/jwt-payload.interface';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post('article/:id')
    @UseGuards(JwtAuthGuard)
    createArticleComment(
        @UserReq() user: JwtPayload,
        @Body() body: CreateUserDto,
        @Param('id') articleId: string,
    ) {
        const { content, parentId } = body;

        return this.commentsService.createArticleComment(user.userId, +articleId, content, parentId)
    }

    @Get('article/:id')
    getArticleComments(
        @Param('id') articleId: string,
        @Query('offset') offset = '0',
        @Query('limit') limit = '5',
    ) {
        return this.commentsService.getArticleComments(
            +articleId,
            Number(limit),
            Number(offset),
        );
    }

    @Get(':id/replies')
    getCommentReplies(
        @Param('id') parentId: string,
        @Query('offset') offset = '0',
        @Query('limit') limit = '3',
    ) {
        return this.commentsService.getCommentReplies(
            Number(parentId),
            Number(limit),
            Number(offset),
        );
    }
}
