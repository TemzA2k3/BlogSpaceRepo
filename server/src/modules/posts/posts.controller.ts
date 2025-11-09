import {
    Controller,
    Get,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
    UseGuards
} from '@nestjs/common';
import { File as MulterFile } from 'multer';

import { UserReq } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { type JwtPayload } from '@/shared/types/jwt-payload.interface';

import { ImageUploadInterceptor } from "@/common/interceptors/image-upload.interceptor"
import { ParseJsonArrayPipe } from "@/common/pipes/parse-json-array.pipe"

import { PostsService } from './posts.service';
import { CreatePostDto } from "./dtos/create-post.dto"



@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {}

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
    @UseGuards(JwtAuthGuard)
    findAll(@UserReq() user: JwtPayload) {
        return this.postsService.findAll(user.userId);
    }

}
