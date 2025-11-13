import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtSharedModule } from '@/common/jwt/jwt.module'
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';

import { Article } from '@/database/entities/article.entity';
import { Hashtag } from '@/database/entities/hashtag.entity';
import { User } from '@/database/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Article, Hashtag, User]),
        JwtSharedModule,
    ],
    providers: [ArticlesService],
    controllers: [ArticlesController]
})
export class ArticlesModule {}
