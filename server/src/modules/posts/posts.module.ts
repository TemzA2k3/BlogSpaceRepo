import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtSharedModule } from '@/common/jwt/jwt.module'

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

import { Post } from '@/database/entities/post.entity';
import { Hashtag } from '@/database/entities/hashtag.entity';
import { User } from '@/database/entities/user.entity';
import { UserRelation } from '@/database/entities/user-relation.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, Hashtag, User, UserRelation]),
        JwtSharedModule,
    ],
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule {}
