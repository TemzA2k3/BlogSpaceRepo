import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

import { Post } from '@/database/entities/post.entity';
import { Hashtag } from '@/database/entities/hashtag.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, Hashtag])
    ],
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule {}
