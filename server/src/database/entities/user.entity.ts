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

export enum UserRole {
    USER = 'user',
    PREMIUM = 'premium',
    ADMIN = 'admin',
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

    @Column({ type: 'text', nullable: true })
    bio?: string;

    @Column({ type: 'varchar', nullable: true })
    location?: string;

    @Column({ type: 'varchar', nullable: true })
    website?: string;

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

    @BeforeInsert()
    generateUsername() {
        if (!this.userName) {
            const random = Math.floor(1000 + Math.random() * 9000);
            const base = this.firstName ? this.firstName.toLowerCase() : 'user';
            this.userName = `@${base}${random}`;
        }
    }
}
