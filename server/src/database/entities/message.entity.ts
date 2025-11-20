import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Chat } from './chat.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.sentMessages, { onDelete: 'CASCADE' })
    sender: User;

    @ManyToOne(() => User, (user) => user.receivedMessages, { onDelete: 'CASCADE' })
    recipient: User;

    @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
    chat: Chat;

    @Column('text')
    text: string;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
