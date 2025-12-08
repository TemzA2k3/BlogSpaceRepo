import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Hashtag } from './hashtag.entity';

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
    likes: number;

    @Column({ default: 0 })
    comments: number;

    @Column({ default: 0 })
    saved: number;

    @Column()
    coverImage: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.articles, { onDelete: 'CASCADE' })
    user: User;

    @ManyToMany(() => Hashtag, (hashtag) => hashtag.articles, { cascade: true })
    @JoinTable()
    hashtags: Hashtag[];
}
