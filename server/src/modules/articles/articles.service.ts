import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { File as MulterFile } from 'multer';

import { Article } from '@/database/entities/article.entity';
import { Hashtag } from '@/database/entities/hashtag.entity';
import { User } from '@/database/entities/user.entity';
import { ArticleLike } from '@/database/entities/article-like.entity';
import { ArticleSave } from '@/database/entities/article-save.entity';
import { Comment } from '@/database/entities/comment.entity';

import { CreateArticleDto } from './dtos/create-article.dto';
import type { CommentDto } from '@/shared/types/comment.types';


@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Hashtag)
        private readonly hashtagRepository: Repository<Hashtag>,

        @InjectRepository(ArticleLike)
        private readonly articleLikeRepository: Repository<ArticleLike>,

        @InjectRepository(ArticleSave)
        private readonly articleSaveRepository: Repository<ArticleSave>,

        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
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

        return {
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
    }

    async findAll(limit = 20, offset = 0, search?: string) {
        const queryBuilder = this.articleRepository
            .createQueryBuilder('article')
            .leftJoinAndSelect('article.user', 'user')
            .leftJoinAndSelect('article.hashtags', 'hashtags')
            .leftJoinAndSelect('article.likesRelation', 'likes')
            .leftJoinAndSelect('article.savesRelation', 'saves');
    
        if (search && search.trim()) {
            queryBuilder.where('LOWER(article.title) LIKE LOWER(:search)', {
                search: `%${search.trim()}%`,
            });
        }
    
        queryBuilder
            .orderBy('article.createdAt', 'DESC')
            .skip(offset)
            .take(limit);
    
        const articles = await queryBuilder.getMany();
    
        return articles.map((article) => ({
            id: article.id,
            title: article.title,
            author: article.user.userName,
            authorId: article.user.id,
            description: article.description,
            sections: article.sections,
            tags: article.hashtags.map((tag) => ({ id: tag.id, name: tag.name })),
            imageUrl: `/uploads/articles/${article.coverImage}`,
            likes: article.likesRelation?.length ?? 0,
            saved: article.savesRelation?.length ?? 0,
        }));
    }

    async getArticleData(articleId: number, userId?: number) {
        const article = await this.articleRepository
            .createQueryBuilder('article')
            .leftJoinAndSelect('article.user', 'user')
            .leftJoinAndSelect('article.hashtags', 'hashtags')
            .leftJoinAndSelect('article.likesRelation', 'likes')
            .leftJoinAndSelect('likes.user', 'likeUser')
            .leftJoinAndSelect('article.savesRelation', 'saves')
            .leftJoinAndSelect('saves.user', 'saveUser')
            .where('article.id = :articleId', { articleId })
            .getOne();

        if (!article) throw new NotFoundException('Article not found');

        const likes = article.likesRelation?.length ?? 0;
        const saved = article.savesRelation?.length ?? 0;

        const likedByCurrentUser = userId
            ? article.likesRelation?.some(like => like.user?.id === userId) ?? false
            : false;

        const savedByCurrentUser = userId
            ? article.savesRelation?.some(save => save.user?.id === userId) ?? false
            : false;

        const rootComments = await this.commentRepository.find({
            where: {
                article: { id: articleId },
                parent: IsNull(),
            },
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: 5,
        });

        const commentsDto: CommentDto[] = [];

        for (const root of rootComments) {
            const replies = await this.commentRepository.find({
                where: { parent: { id: root.id } },
                relations: ['user'],
                order: { createdAt: 'DESC' },
                take: 3,
            });

            commentsDto.push({
                id: root.id,
                firstName: root.user.firstName,
                lastName: root.user.lastName,
                authorId: root.user.id,
                avatar: root.user.avatar || '',
                date: root.createdAt.toISOString(),
                content: root.content,
                indent: false,
                replies: replies.map(r => ({
                    id: r.id,
                    firstName: r.user.firstName,
                    lastName: r.user.lastName,
                    authorId: r.user.id,
                    avatar: r.user.avatar || '',
                    date: r.createdAt.toISOString(),
                    content: r.content,
                    indent: true,
                    replies: [],
                })),
            });
        }

        const rootCommentsCount = await this.commentRepository.count({
            where: { article: { id: articleId }, parent: IsNull() },
        });

        return {
            id: article.id,
            title: article.title,
            description: article.description,
            sections: article.sections,
            coverImage: `/uploads/articles/${article.coverImage}`,
            createdAt: article.createdAt.toISOString(),
            author: {
                id: article.user.id,
                userName: article.user.userName,
                fullName: `${article.user.firstName} ${article.user.lastName}`,
                avatar: article.user.avatar || null,
            },
            hashtags: article.hashtags.map(tag => ({ id: tag.id, name: tag.name })),
            likes,
            saved,
            likedByCurrentUser,
            savedByCurrentUser,
            comments: commentsDto,
            commentsCount: rootCommentsCount,
        };
    }

    async toggleLike(userId: number, articleId: number) {
        const existing = await this.articleLikeRepository.findOne({
            where: { user: { id: userId }, article: { id: articleId } },
        });

        if (existing) {
            await this.articleLikeRepository.remove(existing);
        } else {
            const newLike = this.articleLikeRepository.create({
                user: { id: userId },
                article: { id: articleId },
            });

            await this.articleLikeRepository.save(newLike);
        }

        const totalLikes = await this.articleLikeRepository.count({
            where: { article: { id: articleId } },
        });

        const likedByCurrentUser = !existing;

        return {
            likedByCurrentUser,
            likes: totalLikes,
        };
    }

    async toggleSave(userId: number, articleId: number) {
        const existing = await this.articleSaveRepository.findOne({
            where: { user: { id: userId }, article: { id: articleId } },
        });

        if (existing) {
            await this.articleSaveRepository.remove(existing);
        } else {
            const newSave = this.articleSaveRepository.create({
                user: { id: userId },
                article: { id: articleId },
            });

            await this.articleSaveRepository.save(newSave);
        }

        const totalSaved = await this.articleSaveRepository.count({
            where: { article: { id: articleId } },
        });

        const savedByCurrentUser = !existing;

        return {
            savedByCurrentUser,
            saved: totalSaved,
        };
    }
}
