import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from '@/database/entities/comment.entity';
import { Article } from '@/database/entities/article.entity';
import { Post } from '@/database/entities/post.entity'
import { User } from '@/database/entities/user.entity';

import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';

import { JwtSharedModule } from '@/common/jwt/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        Comment, 
        Article,
        Post,
        User
    ]),
    JwtSharedModule,
    
],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
