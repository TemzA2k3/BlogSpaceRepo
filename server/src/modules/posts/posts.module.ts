import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtSharedModule } from '@/common/jwt/jwt.module'

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

import { Post } from '@/database/entities/post.entity';
import { Hashtag } from '@/database/entities/hashtag.entity';
import { User } from '@/database/entities/user.entity';
import { UserRelation } from '@/database/entities/user-relation.entity';
import { PostLike } from '@/database/entities/post-likes.entity'; 
import { PostSave } from '@/database/entities/post-saves.entity';
import { Comment } from '@/database/entities/comment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Post, Hashtag, 
            User, UserRelation, 
            PostLike, PostSave,
            Comment
        ]),
        JwtSharedModule,
    ],
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule {}
