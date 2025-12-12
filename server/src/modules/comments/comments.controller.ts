import { 
    Body,
    Controller,
    Param,
    Post,
    UseGuards
} from '@nestjs/common';
import { CommentsService } from './comments.service';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { UserReq } from '@/common/decorators/user.decorator';

import { CreateUserDto } from './dtos/create-comment.dto'

import type { JwtPayload } from '@/shared/types/jwt-payload.interface';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post('article/:id')
    @UseGuards(JwtAuthGuard)
    createArticleComment(
        @UserReq() user: JwtPayload,
        @Body() body: CreateUserDto,
        @Param('id') articleId: string,
    ){
        const { content, parentId } = body;

        return this.commentsService.createArticleComment(user.userId, +articleId, content, parentId)
    }
}
