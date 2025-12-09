import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity('post_likes')
@Unique(['post', 'user'])
export class PostLike {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Post, post => post.likesRelation, { onDelete: 'CASCADE' })
    post: Post;

    @ManyToOne(() => User, user => user.likedPosts, { onDelete: 'CASCADE' })
    user: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
