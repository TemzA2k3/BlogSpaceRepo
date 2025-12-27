import { 
    Entity, 
    PrimaryGeneratedColumn, 
    ManyToOne, 
    CreateDateColumn, 
    Unique 
} from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity('post_saves')
@Unique(['post', 'user'])
export class PostSave {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, post => post.savesRelation, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => User, user => user.savedPosts, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
