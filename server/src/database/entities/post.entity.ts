import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    OneToMany
} from 'typeorm';

import { User } from './user.entity';
import { Hashtag } from './hashtag.entity';
import { PostLike } from './post-likes.entity';
import { PostSave } from './post-saves.entity';
import { Comment } from './comment.entity'; 

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: string;

    @Column({ default: 0 })
    comments: number;

    @Column({ nullable: true })
    image?: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => Comment, (comment) => comment.post)
    commentsRelation: Comment[];

    @OneToMany(() => PostLike, like => like.post)
    likesRelation: PostLike[];

    @OneToMany(() => PostSave, save => save.post)
    savesRelation: PostSave[];

    @ManyToMany(() => Hashtag, (hashtag) => hashtag.posts, { cascade: true })
    @JoinTable()
    hashtags: Hashtag[];
}
