import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    OneToMany
} from 'typeorm';

import { Post } from './post.entity';
import { UserRelation } from './user-relation.entity'
import { Article } from './article.entity';
import { Message } from './message.entity';
import { PostLike } from './post-likes.entity';
import { PostSave } from './post-saves.entity';
import { ArticleLike } from './article-like.entity';
import { ArticleSave } from './article-save.entity';

export enum UserRole {
    USER = 'user',
    PREMIUM = 'premium',
    ADMIN = 'admin',
}

export enum WhoCanMessage {
    EVERYONE = 'everyone',
    FOLLOWERS = 'followers',
    NOBODY = 'nobody',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    userName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: string;

    @Column({ type: 'text', nullable: true, default: null })
    avatar: string | null;

    @Column({ default: false })
    isBlocked: boolean;

    @Column({ default: false })
    online: boolean;

    @Column({ type: 'text', nullable: true })
    bio?: string;

    @Column({ type: 'varchar', nullable: true })
    location?: string;

    @Column({ type: 'varchar', nullable: true })
    website?: string;

    @Column({ default: true })
    isPublicProfile: boolean;

    @Column({
        type: 'enum',
        enum: WhoCanMessage,
        default: WhoCanMessage.EVERYONE,
    })
    whoCanMessage: WhoCanMessage;

    @Column({ type: 'varchar', default: 'en' })
    displayLanguage: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @OneToMany(() => Post, (posts) => posts.user)
    posts: Post[];

    @OneToMany(() => Article, (articles) => articles.user)
    articles: Article[];

    @OneToMany(() => UserRelation, (relation) => relation.sourceUser)
    relationsFrom: UserRelation[];

    @OneToMany(() => UserRelation, (relation) => relation.targetUser)
    relationsTo: UserRelation[];

    @OneToMany(() => Message, (msg) => msg.sender)
    sentMessages: Message[];

    @OneToMany(() => Message, (msg) => msg.recipient)
    receivedMessages: Message[];

    @OneToMany(() => PostLike, like => like.user)
    likedPosts: PostLike[];

    @OneToMany(() => PostSave, save => save.user)
    savedPosts: PostSave[];

    @OneToMany(() => ArticleLike, (like) => like.user)
    articleLikes: ArticleLike[];

    @OneToMany(() => ArticleSave, (save) => save.user)
    articleSaves: ArticleSave[];

    @BeforeInsert()
    generateUsername() {
        if (!this.userName) {
            const random = Math.floor(1000 + Math.random() * 9000);
            const base = this.firstName ? this.firstName.toLowerCase() : 'user';
            this.userName = `@${base}${random}`;
        }
    }
}