import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/database/entities/user.entity';
import { Post } from '@/database/entities/post.entity'
import { UserRelation } from '@/database/entities/user-relation.entity';
import { PostLike } from '@/database/entities/post-likes.entity';
import { PostSave } from '@/database/entities/post-saves.entity';
import { Chat } from '@/database/entities/chat.entity';
import { Article } from '@/database/entities/article.entity';
import { Comment } from '@/database/entities/comment.entity';

import { JwtSharedModule } from '@/common/jwt/jwt.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { ProfileStatsHelper } from './helpers/profile-stats.helper';


@Module({
  imports: [
    TypeOrmModule.forFeature([
        User, UserRelation, 
        Post, PostLike,
        PostSave, Chat,
        Article, Comment
    ]),
    JwtSharedModule
],
  providers: [UsersService, ProfileStatsHelper],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
