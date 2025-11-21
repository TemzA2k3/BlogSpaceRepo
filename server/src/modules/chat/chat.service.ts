import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';

import { Chat } from '@/database/entities/chat.entity';
import { Message } from '@/database/entities/message.entity';
import { User } from '@/database/entities/user.entity';


@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>
    ) { }

    async createChat(currentUserId: number, targetUserId: number) {
        if (currentUserId === targetUserId) {
            throw new BadRequestException('Нельзя создать чат с самим собой');
        }

        const currentUser = await this.userRepository.findOne({ where: { id: currentUserId } });
        const targetUser = await this.userRepository.findOne({ where: { id: targetUserId } });

        if (!currentUser || !targetUser) {
            throw new NotFoundException('Пользователь не найден');
        }

        // Проверяем, есть ли уже чат между этими пользователями
        let chat = await this.chatRepository
            .createQueryBuilder('chat')
            .leftJoin('chat.participants', 'user')
            .where(qb => {
                const subQuery = qb.subQuery()
                    .select('chatSub.id')
                    .from(Chat, 'chatSub')
                    .leftJoin('chatSub.participants', 'userSub')
                    .where('userSub.id IN (:...ids)', { ids: [currentUserId, targetUserId] })
                    .groupBy('chatSub.id')
                    .having('COUNT(userSub.id) = 2')
                    .getQuery();
                return 'chat.id IN ' + subQuery;
            })
            .leftJoinAndSelect('chat.participants', 'participants')
            .getOne();

        if (!chat) {
            const newChat = this.chatRepository.create({
                participants: [currentUser, targetUser],
            });
            chat = await this.chatRepository.save(newChat);
        }

        // Маппинг под фронтенд — возвращаем объект ChatUser для targetUser + chatId
        const result = {
            id: targetUser.id,
            chatId: chat.id,  // <-- добавили chatId
            firstName: targetUser.firstName,
            lastName: targetUser.lastName,
            avatar: targetUser.avatar,
            lastMessage: null,
            time: null,
            unread: 0,
            online: false,
        };

        return result;
    }


    async getAllUserChats(userId: number) {
        const chats = await this.chatRepository
            .createQueryBuilder('chat')
            .innerJoin('chat.participants', 'participant', 'participant.id = :userId', { userId })
            .leftJoinAndSelect('chat.participants', 'participants')
            .leftJoinAndSelect('chat.messages', 'messages')
            .leftJoinAndSelect('messages.sender', 'sender')
            .getMany();

        const result = chats.map(chat => {
            const otherUser = chat.participants.find(u => u.id !== userId);
            if (!otherUser) return null;

            const lastMsg = chat.messages?.length
                ? chat.messages[chat.messages.length - 1]
                : null;

            const unreadCount = chat.messages?.filter(
                m => m.sender.id !== userId && !m.isRead
            ).length || 0;

            return {
                id: otherUser.id,
                chatId: chat.id,
                firstName: otherUser.firstName,
                lastName: otherUser.lastName,
                avatar: otherUser.avatar || null,
                lastMessage: lastMsg ? lastMsg.text : null,
                time: lastMsg ? 
                    new Date(lastMsg.createdAt).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }) : null,
                unread: unreadCount,
                online: false,
            };
        });

        return result.filter(Boolean);
    }

    async getChatMessages(chatId: number, userId: number) {
        // 1. Проверяем, что чат существует и пользователь — участник чата
        const chat = await this.chatRepository.findOne({
            where: { id: chatId },
            relations: ['participants'],
        });

        if (!chat) {
            throw new NotFoundException('Чат не найден');
        }

        const isParticipant = chat.participants.some(u => u.id === userId);
        if (!isParticipant) {
            throw new ForbiddenException('Вы не участник этого чата');
        }

        // 2. Загружаем сообщения чата
        const messages = await this.messageRepository.find({
            where: { chat: { id: chatId } },
            relations: ['sender', 'recipient'],
            order: { createdAt: 'ASC' },
        });

        return messages.map(msg => ({
            id: msg.id,
            text: msg.text,
            sender: msg.sender.id === userId ? 'me' : 'other',
            time: new Date(msg.createdAt).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }),
        }));
    }


    // Sockets
    async createMessage(chatId: number, senderId: number, text: string) {
        const chat = await this.chatRepository.findOne({
            where: { id: chatId },
            relations: ['participants'],
        });
        if (!chat) throw new NotFoundException('Chat not found');

        const sender = await this.userRepository.findOne({ where: { id: senderId } });
        if (!sender) throw new NotFoundException('Sender not found');

        const message = this.messageRepository.create({
            chat,
            sender,
            text,
        });

        await this.messageRepository.save(message);

        return {
            id: message.id,
            chatId: chat.id,
            senderId: sender.id,
            text: message.text,
            createdAt: message.createdAt,
        };
    }

    async getChatById(chatId: number) {
        return this.chatRepository.findOne({
            where: { id: chatId },
            relations: ['participants'],
        });
    }

}
