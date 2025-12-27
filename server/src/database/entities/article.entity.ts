import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';

import { User } from './user.entity';
import { Hashtag } from './hashtag.entity';
import { ArticleLike } from './article-like.entity';
import { ArticleSave } from './article-save.entity';
import { Comment } from './comment.entity'; 

import type { ArticleSection } from '@/shared/types/articles-types'

@Entity('articles')
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'json' })
    sections: ArticleSection[];

    @Column({ default: 0 })
    comments: number;

    @Column()
    coverImage: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.articles, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => Comment, (comment) => comment.article)
    commentsRelation: Comment[];

    @OneToMany(() => ArticleLike, (like) => like.article)
    likesRelation: ArticleLike[];

    @OneToMany(() => ArticleSave, (save) => save.article)
    savesRelation: ArticleSave[];

    @ManyToMany(() => Hashtag, (hashtag) => hashtag.articles, { cascade: true })
    @JoinTable()
    hashtags: Hashtag[];
}
