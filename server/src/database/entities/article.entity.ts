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

@Entity('articles')
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    title: string;

    @Column({ nullable: true })
    description?: string;

    @Column()
    content: string;

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

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    user: User;

    @ManyToMany(() => Hashtag, (hashtag) => hashtag.posts, { cascade: true })
    @JoinTable()
    hashtags: Hashtag[];
}
