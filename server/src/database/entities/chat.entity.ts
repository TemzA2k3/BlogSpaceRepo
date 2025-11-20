import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User)
    @JoinTable({
        name: 'chat_users',
        joinColumn: { name: 'chat_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    })
    participants: User[];

    // сообщения
    @OneToMany(() => Message, (msg) => msg.chat)
    messages: Message[];

    @CreateDateColumn()
    createdAt: Date;
}
