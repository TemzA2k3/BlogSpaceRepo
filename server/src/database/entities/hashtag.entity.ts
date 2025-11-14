import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToMany 
} from 'typeorm';

import { Post } from './post.entity';
import { Article } from './article.entity';

@Entity('hashtags')
export class Hashtag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => Post, (posts) => posts.hashtags)
    posts: Post[];

    @ManyToMany(() => Article, (articles) => articles.hashtags)
    articles: Article[];    
}
