import { 
    Controller,
    Post,
    Get,
    UseGuards,
    UseInterceptors,
    Body,
    UploadedFile
} from '@nestjs/common';
import { File as MulterFile } from 'multer';

import { ArticlesService } from './articles.service';

import { ParseJsonArrayPipe } from "@/common/pipes/parse-json-array.pipe"

import { UserReq } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { type JwtPayload } from '@/shared/types/jwt-payload.interface';

import { ImageUploadInterceptor } from "@/common/interceptors/image-upload.interceptor"

import { CreateArticleDto } from './dtos/create-article.dto';

@Controller('articles')
export class ArticlesController {

    constructor(private readonly articlesService: ArticlesService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ImageUploadInterceptor({
        fieldName: 'coverImage',
        folder: 'articles',
        prefix: 'article',
        maxSizeMB: 5,
    }))
    createArticle(
        @UserReq() user: JwtPayload,
        @Body('title') title: string,
        @UploadedFile() file: MulterFile,
        @Body('description') description?: string,
        @Body('content') content?: string,
        @Body('hashtags', new ParseJsonArrayPipe(true)) hashtags?: string[],
        
    ) {        
        const articleData: CreateArticleDto = { title, description, content, hashtags }
    
        return this.articlesService.createArticle(user.userId, articleData, file);
    }

    @Get()
    findAll() {
        return this.articlesService.findAll();
    }
}
