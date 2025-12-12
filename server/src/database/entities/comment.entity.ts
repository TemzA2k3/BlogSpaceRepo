import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  import { Post } from './post.entity';
  import { Article } from './article.entity';
  
  @Entity('comments')
  export class Comment {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'text' })
    content: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    // Кто написал комментарий
    @ManyToOne(() => User, (user) => user.id, { eager: true, onDelete: 'CASCADE' })
    user: User;
  
    // Комментарий может относиться к посту
    @ManyToOne(() => Post, (post) => post.comments, { nullable: true, onDelete: 'CASCADE' })
    post?: Post;
  
    // Или к статье
    @ManyToOne(() => Article, (article) => article.comments, { nullable: true, onDelete: 'CASCADE' })
    article?: Article;
  
    // Родительский комментарий для вложенных ответов
    @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true, onDelete: 'CASCADE' })
    parent?: Comment;
  
    // Ответы на этот комментарий
    @OneToMany(() => Comment, (comment) => comment.parent)
    replies: Comment[];
  }
  