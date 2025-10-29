import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    Unique,
  } from 'typeorm';
  import { User } from './user.entity';
  
  export enum RelationType {
    FOLLOW = 'follow',
    BLOCK = 'block',
  }
  
  @Entity('user_relations')
  @Unique(['sourceUser', 'targetUser'])
  export class UserRelation {
    @PrimaryGeneratedColumn()
    id: number;
  
    // кто выполняет действие (подписывается / блокирует)
    @ManyToOne(() => User, (user) => user.relationsFrom, { onDelete: 'CASCADE' })
    sourceUser: User;
  
    // на кого направлено действие
    @ManyToOne(() => User, (user) => user.relationsTo, { onDelete: 'CASCADE' })
    targetUser: User;
  
    @Column({
      type: 'enum',
      enum: RelationType,
      default: RelationType.FOLLOW,
    })
    type: RelationType;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @Column({ default: false })
    isAccepted: boolean; // можно использовать для приватных профилей
  }
  