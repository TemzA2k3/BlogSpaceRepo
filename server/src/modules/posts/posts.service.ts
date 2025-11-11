import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm';
import { File as MulterFile } from 'multer';

import { Post } from '@/database/entities/post.entity';
import { User, UserRole } from '@/database/entities/user.entity';
import { UserRelation, RelationType } from '@/database/entities/user-relation.entity';
import { Hashtag } from '@/database/entities/hashtag.entity'

import { CreatePostDto } from '@/modules/posts/dtos/create-post.dto'

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Hashtag)
        private readonly hashtagRepository: Repository<Hashtag>,

        @InjectRepository(UserRelation)
        private readonly userRelationRepository: Repository<UserRelation>
    ) { }

    async createPost(userId: number, postData: CreatePostDto, image?: MulterFile) {
        const { content, hashtags = [] } = postData;
      
        // Найти пользователя
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
      
        // Подготовка хэштегов
        const hashtagEntities: Hashtag[] = [];
      
        for (const tagName of hashtags) {
          const lowerTag = tagName.toLowerCase().trim();
          if (!lowerTag) continue;
      
          let hashtag = await this.hashtagRepository.findOne({ where: { name: lowerTag } });
          if (!hashtag) {
            hashtag = this.hashtagRepository.create({ name: lowerTag });
            await this.hashtagRepository.save(hashtag);
          }
      
          hashtagEntities.push(hashtag);
        }
      
        // Создать пост
        const relativeImagePath = image ? `/uploads/posts/${image.filename}` : undefined;
      
        const newPost = this.postRepository.create({
          content,
          image: relativeImagePath,
          user,
          hashtags: hashtagEntities,
        });
      
        await this.postRepository.save(newPost);
      
        // Повторно получаем пост с нужными связями
        const savedPost = await this.postRepository.findOne({
          where: { id: newPost.id },
          relations: ['user', 'hashtags'],
        });

        if (!savedPost) {
            throw new NotFoundException('Post not found after creation');
          }
      
        // Преобразуем под нужную структуру
        return {
          id: savedPost.id,
          content: savedPost.content,
          hashtags: savedPost.hashtags?.map(h => ({ id: h.id, name: h.name })) || [],
          likes: savedPost.likes,
          comments: savedPost.comments,
          saved: savedPost.saved,
          image: savedPost.image ?? null,
          createdAt: savedPost.createdAt,
          user: {
            id: savedPost.user.id,
            firstName: savedPost.user.firstName,
            lastName: savedPost.user.lastName,
            username: savedPost.user.userName,
            avatar: savedPost.user.avatar,
          },
        };
      }
      

      async findAll(userId: number) {
        const followRelations = await this.userRelationRepository.find({
          where: { 
            sourceUser: { id: userId },
            type: RelationType.FOLLOW,
          },
          relations: ['targetUser'],
        });
      
        const followedUserIds = followRelations.map(rel => rel.targetUser.id);
      
        followedUserIds.push(userId);
      
        const posts = await this.postRepository.find({
          where: {
            user: { id: In(followedUserIds) },
          },
          relations: ['user', 'hashtags'],
          order: { createdAt: 'DESC' },
        });
      
        return posts.map(post => ({
          id: post.id,
          content: post.content,
          hashtags: post.hashtags?.map(h => ({ id: h.id, name: h.name })) || [],
          likes: post.likes,
          comments: post.comments,
          saved: post.saved,
          image: post.image ?? null,
          createdAt: post.createdAt,
          avatar: post.user.avatar,
          firstName: post.user.firstName,
          lastName: post.user.lastName,
          username: post.user.userName,
          userId: post.user.id
        }));
      }
      
      async deletePost(postId: number, userId: number) {
        const post = await this.postRepository.findOne({
          where: { id: postId },
          relations: ['user', 'hashtags'],
        });
    
        if (!post) {
          throw new NotFoundException('Post not found');
        }
    
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
          throw new NotFoundException('User not found');
        }
    
        if (post.user.id !== user.id && user.role !== UserRole.ADMIN) {
          throw new ForbiddenException('You are not allowed to delete this post');
        }
    
        // Удаляем пост
        await this.postRepository.remove(post);
    
        return { message: 'Post successfully deleted', postId };
      }
}
