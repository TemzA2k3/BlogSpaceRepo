import {
    Controller,
    Get,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    Delete,
    Param,
    Patch
} from '@nestjs/common';
import { File as MulterFile } from 'multer';

import { UserReq } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@/common/guards/optional-jwt-auth.guard';
import { type JwtPayload } from '@/shared/types/jwt-payload.interface';

import { ImageUploadInterceptor } from "@/common/interceptors/image-upload.interceptor"
import { ParseJsonArrayPipe } from "@/common/pipes/parse-json-array.pipe"

import { PostsService } from './posts.service';

import { CreatePostDto } from "./dtos/create-post.dto"



@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ImageUploadInterceptor({
        fieldName: 'image',
        folder: 'posts',
        prefix: 'post',
        maxSizeMB: 5,
    }))
    createPost(
        @UserReq() user: JwtPayload,
        @Body('content') content?: string,
        @Body('hashtags', new ParseJsonArrayPipe(true)) hashtags?: string[],
        @UploadedFile() file?: MulterFile,
    ) {
        const createPostDto: CreatePostDto = { content, hashtags };

        return this.postsService.createPost(user.userId, createPostDto, file);
    }

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    findAll(@UserReq() user?: JwtPayload) {
        return this.postsService.findAll(user?.userId);
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    deletePost(
        @UserReq() user: JwtPayload,
        @Param('id') postId: string
    ) {
        return this.postsService.deletePost(+postId, user.userId)
    }

    @Patch(':id/like')
    @UseGuards(JwtAuthGuard)
    async toggleLike(
        @UserReq() user: JwtPayload,
        @Param('id') postId: string,
    ) {
        return this.postsService.toggleLike(+postId, user.userId);
    }

    @Patch(':id/save')
    @UseGuards(JwtAuthGuard)
    async toggleSave(
        @UserReq() user: JwtPayload,
        @Param('id') postId: string,
    ) {
        return this.postsService.toggleSave(+postId, user.userId);
    }

}
