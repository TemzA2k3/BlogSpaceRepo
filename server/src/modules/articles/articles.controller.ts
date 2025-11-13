import { 
    Controller,
    Post,
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

@Controller('articles')
export class ArticlesController {

    constructor(private readonly articlesService: ArticlesService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ImageUploadInterceptor({
        fieldName: 'image',
        folder: 'articles',
        prefix: 'article',
        maxSizeMB: 5,
    }))
    createArticle(
        // TODO добавть необходимые параметры
        @UserReq() user: JwtPayload,
        @Body('hashtags', new ParseJsonArrayPipe(true)) hashtags?: string[],
        @UploadedFile() file?: MulterFile,
    ) {
        const createArticleDto = {}
    
        return this.articlesService.createArticle();
    }
}
