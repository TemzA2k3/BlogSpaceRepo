import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { File as MulterFile } from 'multer';

import { Post } from '@/database/entities/post.entity';
import { User } from '@/database/entities/user.entity';
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
    ) { }

    async createPost(userId, postData: CreatePostDto, image?: MulterFile) {
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

        // Вернуть пост с привязками
        return this.postRepository.findOne({
            where: { id: newPost.id },
            relations: ['user', 'hashtags'],
        });
    }
}
