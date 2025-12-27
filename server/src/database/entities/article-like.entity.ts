import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
} from "typeorm";

import { User } from "@/database/entities/user.entity";
import { Article } from "@/database/entities/article.entity";

@Entity('article_likes')
export class ArticleLike {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Article, (article) => article.likesRelation, {
        onDelete: "CASCADE"
    })
    article: Article;

    @ManyToOne(() => User, (user) => user.articleLikes, {
        onDelete: "CASCADE"
    })
    user: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
