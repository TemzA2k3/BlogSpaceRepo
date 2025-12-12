import {
    Injectable,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from '@/database/entities/comment.entity';
import { User } from '@/database/entities/user.entity';
import { Article } from '@/database/entities/article.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,

        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    private mapToDto(comment: Comment) {
        return {
            id: comment.id,
            authorId: comment.user.id,
            firstName: comment.user.firstName,
            lastName: comment.user.lastName,
            avatar: comment.user.avatar,
            date: comment.createdAt.toISOString(),
            content: comment.content,
            indent: !!comment.parent,
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

        // 4. Создать комментарий
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
}
