import {
    Controller,
    Post,
    Get,
    UseGuards,
    UseInterceptors,
    Body,
    UploadedFile,
    Param,
    Patch
} from '@nestjs/common';
import { File as MulterFile } from 'multer';

import { ArticlesService } from './articles.service';

import { ParseJsonArrayPipe } from "@/common/pipes/parse-json-array.pipe"

import { UserReq } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { type JwtPayload } from '@/shared/types/jwt-payload.interface';

import { ImageUploadInterceptor } from "@/common/interceptors/image-upload.interceptor"

import { CreateArticleDto } from './dtos/create-article.dto';
import { SectionDto } from './dtos/sections.dto'
import { OptionalJwtAuthGuard } from '@/common/guards/optional-jwt-auth.guard';

@Controller('articles')
export class ArticlesController {

    constructor(private readonly articlesService: ArticlesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        ImageUploadInterceptor({
            fieldName: 'coverImage',
            folder: 'articles',
            prefix: 'article',
            maxSizeMB: 5,
        }),
    )
    createArticle(
        @UserReq() user: JwtPayload,
        @Body('title') title: string,
        @Body('description') description: string,
        @Body('sections', new ParseJsonArrayPipe(true)) sections: SectionDto[],
        @Body('hashtags', new ParseJsonArrayPipe(true)) hashtags?: string[],
        @UploadedFile() file?: MulterFile,
    ) { 
        const articleData: CreateArticleDto = {
            title,
            description,
            sections,
            hashtags,
        };

        return this.articlesService.createArticle(user.userId, articleData, file);
    }

    @Get()
    findAll() {        
        return this.articlesService.findAll();
    }

    @Get(':id')
    @UseGuards(OptionalJwtAuthGuard)
    getArticleData(
        @UserReq() user: JwtPayload,
        @Param('id') id: string,
    ){  
        return this.articlesService.getArticleData(+id, user?.userId);
    }

    @Patch(':id/like')
    @UseGuards(JwtAuthGuard)
    toggleArticleLike(
        @UserReq() user: JwtPayload,
        @Param('id') id: string,
    ) {
        return this.articlesService.toggleLike(user.userId, +id);
    }

    @Patch(':id/save')
    @UseGuards(JwtAuthGuard)
    toggleArticleSave(
        @UserReq() user: JwtPayload,
        @Param('id') id: string,
    ) {
        return this.articlesService.toggleSave(user.userId, +id);
    }

}
