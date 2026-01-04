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
  
    @ManyToOne(() => User, (user) => user.id, { eager: true, onDelete: 'CASCADE' })
    user: User;
  
    @ManyToOne(() => Post, (post) => post.comments, { nullable: true, onDelete: 'CASCADE' })
    post?: Post;
  
    @ManyToOne(() => Article, (article) => article.comments, { nullable: true, onDelete: 'CASCADE' })
    article?: Article;

    @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true, onDelete: 'CASCADE' })
    parent?: Comment;
  
    @OneToMany(() => Comment, (comment) => comment.parent)
    replies: Comment[];
  }
  