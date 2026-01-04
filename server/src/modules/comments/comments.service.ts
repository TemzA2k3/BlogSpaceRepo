import {
    Injectable,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Comment } from '@/database/entities/comment.entity';
import { User } from '@/database/entities/user.entity';
import { Article } from '@/database/entities/article.entity';
import { Post } from '@/database/entities/post.entity';

import type { CommentDto } from '@/shared/types/comment.types';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,

        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) { }

    private mapToDto(comment: Comment, indent = false): CommentDto {
        return {
            id: comment.id,
            authorId: comment.user.id,
            firstName: comment.user.firstName,
            lastName: comment.user.lastName,
            avatar: comment.user.avatar || '',
            date: comment.createdAt.toISOString(),
            content: comment.content,
            indent,
            replies: [],
        };
    }

    async createArticleComment(
        userId: number,
        articleId: number,
        content: string,
        parentId?: number
    ) {
        if (!content?.trim()) {
            throw new BadRequestException('Comment content cannot be empty');
        }

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) throw new NotFoundException('User not found');

        const article = await this.articleRepository.findOne({
            where: { id: articleId },
        });
        if (!article) throw new NotFoundException('Article not found');

        let parentComment: Comment | undefined = undefined;

        if (parentId) {
            const foundParent = await this.commentRepository.findOne({
                where: { id: parentId },
                relations: ['article'],
            });

            if (!foundParent) {
                throw new NotFoundException('Parent comment not found');
            }

            if (foundParent.article?.id !== articleId) {
                throw new BadRequestException(
                    'Parent comment belongs to another article'
                );
            }

            parentComment = foundParent;
        }

        const newCommentEntity = this.commentRepository.create({
            content,
            user,
            article,
            parent: parentComment,
        });

        const saved = await this.commentRepository.save(newCommentEntity);

        const fullComment = await this.commentRepository.findOne({
            where: { id: saved.id },
            relations: ['user', 'parent'],
        });

        if (!fullComment) throw new NotFoundException('Unexpected error');

        return this.mapToDto(fullComment);
    }

    async getArticleComments(
        articleId: number,
        limit = 5,
        offset = 0,
    ): Promise<CommentDto[]> {
        const article = await this.articleRepository.findOne({
            where: { id: articleId },
            select: ['id'],
        });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        const roots = await this.commentRepository.find({
            where: {
                article: { id: articleId },
                parent: IsNull(),
            },
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });

        const result: CommentDto[] = [];

        for (const root of roots) {
            const repliesCount = await this.commentRepository.count({
                where: { parent: { id: root.id } },
            });

            const replies = await this.commentRepository.find({
                where: { parent: { id: root.id } },
                relations: ['user'],
                order: { createdAt: 'ASC' },
                take: 3,
            });

            result.push({
                ...this.mapToDto(root, false),
                replies: replies.map(reply => this.mapToDto(reply, true)),
                repliesCount,
            });
        }

        return result;
    }


    async getCommentReplies(
        parentId: number,
        limit: number,
        offset: number,
    ): Promise<CommentDto[]> {
        const parent = await this.commentRepository.findOne({
            where: { id: parentId },
            select: ['id'],
        });

        if (!parent) {
            throw new NotFoundException('Parent comment not found');
        }

        const replies = await this.commentRepository.find({
            where: { parent: { id: parentId } },
            relations: ['user'],
            order: { createdAt: 'ASC' },
            take: limit,
            skip: offset,
        });

        return replies.map(reply => this.mapToDto(reply, true));
    }

    async getCommentsForPost(
        postId: number,
        limit = 5,
        offset = 0
    ) {
        const roots = await this.commentRepository.find({
            where: {
                post: { id: postId },
                parent: IsNull(),
            },
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });

        const result: CommentDto[] = [];

        for (const root of roots) {
            const repliesCount = await this.commentRepository.count({
                where: { parent: { id: root.id } },
            });

            const replies = await this.commentRepository.find({
                where: { parent: { id: root.id } },
                relations: ['user'],
                order: { createdAt: 'ASC' },
                take: 3,
            });

            result.push({
                id: root.id,
                authorId: root.user.id,
                firstName: root.user.firstName,
                lastName: root.user.lastName,
                avatar: root.user.avatar || '',
                date: root.createdAt.toISOString(),
                content: root.content,
                indent: false,
                replies: replies.map(reply => ({
                    id: reply.id,
                    authorId: reply.user.id,
                    firstName: reply.user.firstName,
                    lastName: reply.user.lastName,
                    avatar: reply.user.avatar || '',
                    date: reply.createdAt.toISOString(),
                    content: reply.content,
                    indent: true,
                })),
                repliesCount,
            });
        }

        return result;
    }

    async createPostComment(
        userId: number,
        postId: number,
        content: string,
        parentId?: number
    ) {
        if (!content?.trim()) {
            throw new BadRequestException('Comment content cannot be empty');
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const post = await this.postRepository.findOne({ where: { id: postId } });
        if (!post) throw new NotFoundException('Post not found');

        let parentComment: Comment | undefined = undefined;
        if (parentId) {
            const foundParent = await this.commentRepository.findOne({
                where: { id: parentId },
                relations: ['post'],
            });
            if (!foundParent) throw new NotFoundException('Parent comment not found');
            if (foundParent.post?.id !== postId) {
                throw new BadRequestException('Parent comment belongs to another post');
            }
            parentComment = foundParent;
        }

        const newCommentEntity = this.commentRepository.create({
            content,
            user,
            post,
            parent: parentComment,
        });

        const saved = await this.commentRepository.save(newCommentEntity);
        const fullComment = await this.commentRepository.findOne({
            where: { id: saved.id },
            relations: ['user', 'parent'],
        });

        if (!fullComment) throw new NotFoundException('Unexpected error');

        return this.mapToDto(fullComment, !!parentId);
    }

    async getPostCommentReplies(
        parentId: number,
        limit: number,
        offset: number
    ) {
        const parent = await this.commentRepository.findOne({
            where: { id: parentId },
            select: ['id'],
        });

        if (!parent) throw new NotFoundException('Parent comment not found');

        const replies = await this.commentRepository.find({
            where: { parent: { id: parentId } },
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });

        return replies.map(reply => this.mapToDto(reply, true));
    }


}
