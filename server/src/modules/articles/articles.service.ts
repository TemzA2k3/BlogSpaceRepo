import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File as MulterFile } from 'multer';

import { Article } from '@/database/entities/article.entity';
import { Hashtag } from '@/database/entities/hashtag.entity';
import { User } from '@/database/entities/user.entity';
import { CreateArticleDto } from './dtos/create-article.dto';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Hashtag)
        private readonly hashtagRepository: Repository<Hashtag>,
    ) { }

    async createArticle(
        userId: number,
        articleData: CreateArticleDto,
        image: MulterFile,
    ) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        let hashtags: Hashtag[] = [];
        if (articleData.hashtags?.length) {
            hashtags = await Promise.all(
                articleData.hashtags.map(async (tagName) => {
                    const name = tagName.trim().toLowerCase();
                    let hashtag = await this.hashtagRepository.findOne({ where: { name } });
                    if (!hashtag) {
                        hashtag = this.hashtagRepository.create({ name });
                        await this.hashtagRepository.save(hashtag);
                    }
                    return hashtag;
                }),
            );
        }

        const newArticle = this.articleRepository.create({
            title: articleData.title,
            description: articleData.description,
            sections: articleData.sections,
            coverImage: image.filename,
            user,
            hashtags,
        });

        await this.articleRepository.save(newArticle);

        const preview = {
            id: newArticle.id,
            title: newArticle.title,
            author: user.userName,
            authorId: user.id,
            description: newArticle.description,
            sections: newArticle.sections,
            tags: hashtags.map((h) => ({
                id: h.id,
                name: h.name.startsWith('#') ? h.name : `#${h.name}`,
            })),
            imageUrl: `/uploads/articles/${newArticle.coverImage}`,
        };

        return preview;
    }

    async findAll() {
        const articles = await this.articleRepository.find({
            relations: ['user', 'hashtags'],
            order: { createdAt: 'DESC' },
            take: 12,
        });

        return articles.map((article) => ({
            id: article.id,
            title: article.title,
            author: article.user.userName,
            authorId: article.user.id,
            description: article.description,
            sections: article.sections,
            tags: article.hashtags.map((tag) => ({
                id: tag.id,
                name: tag.name.startsWith('#') ? tag.name : `#${tag.name}`,
            })),
            imageUrl: `/uploads/articles/${article.coverImage}`,
        }));
    }

    async getArticleData(articleId: number) {
        const article = await this.articleRepository.findOne({
            where: { id: articleId },
            relations: ['user', 'hashtags'],
        });

        if (!article) throw new Error('Article not found');
        
        return {
            id: article.id,
            title: article.title,
            description: article.description,
            sections: article.sections,
            coverImage: `/uploads/articles/${article.coverImage}`,
            createdAt: article.createdAt,
            author: {
                id: article.user.id,
                userName: article.user.userName,
                fullName: `${article.user.firstName} ${article.user.lastName}`,
                avatar: article.user.avatar || null,
            },
            hashtags: article.hashtags.map(tag => ({
                id: tag.id,
                name: tag.name,
            })),
            likes: article.likes,
            comments: article.comments,
            saved: article.saved,
        };
    }

}
