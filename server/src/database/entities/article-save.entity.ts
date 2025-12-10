import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
} from "typeorm";

import { User } from "@/database/entities/user.entity";
import { Article } from "@/database/entities/article.entity";

@Entity('article_saves')
export class ArticleSave {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.articleSaves, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Article, (article) => article.savesRelation, { onDelete: 'CASCADE' })
    article: Article;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
