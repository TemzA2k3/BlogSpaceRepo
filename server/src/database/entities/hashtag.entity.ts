import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToMany 
} from 'typeorm';

import { Post } from './post.entity';

@Entity('hashtags')
export class Hashtag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => Post, (post) => post.hashtags)
    posts: Post[];
}
