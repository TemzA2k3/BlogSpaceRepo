import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm';

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

        const result = {
            id: targetUser.id,
            chatId: chat.id,
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

    async getAllUserChats(userId: number, offset = 0, limit = 20, search?: string) {
        const queryBuilder = this.chatRepository
            .createQueryBuilder('chat')
            .innerJoin('chat.participants', 'participant', 'participant.id = :userId', { userId })
            .leftJoinAndSelect('chat.participants', 'participants')
            .leftJoinAndSelect('chat.messages', 'messages')
            .leftJoinAndSelect('messages.sender', 'sender');
    
            if (search && search.trim()) {
                const searchTerm = `%${search.trim().toLowerCase()}%`;
                queryBuilder.andWhere(
                    `EXISTS (
                        SELECT 1 FROM chat_users cu
                        INNER JOIN users u ON u.id = cu.user_id
                        WHERE cu.chat_id = chat.id
                        AND u.id != :userId
                        AND (
                            LOWER(u."firstName") LIKE :search 
                            OR LOWER(u."lastName") LIKE :search
                            OR LOWER(CONCAT(u."firstName", ' ', u."lastName")) LIKE :search
                        )
                    )`,
                    { userId, search: searchTerm }
                );
            }
    
        const chats = await queryBuilder
            .orderBy('chat.createdAt', 'DESC')
            .skip(offset)
            .take(limit)
            .getMany();
    
        const result = chats.map(chat => {
            const otherUser = chat.participants.find(u => u.id !== userId);
            if (!otherUser) return null;
    
            const sortedMessages = chat.messages?.sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            ) || [];
    
            const lastMsg = sortedMessages.length
                ? sortedMessages[sortedMessages.length - 1]
                : null;
    
            const unreadCount = sortedMessages.filter(
                m => m.sender.id !== userId && !m.isRead
            ).length;
    
            return {
                id: otherUser.id,
                chatId: chat.id,
                firstName: otherUser.firstName,
                lastName: otherUser.lastName,
                avatar: otherUser.avatar || null,
                lastMessage: lastMsg ? lastMsg.text : null,
                time: lastMsg ? lastMsg.createdAt : null,
                unread: unreadCount,
                online: false,
            };
        });
    
        return result.filter(Boolean);
    }

    async deleteChat(chatId: number, userId: number) {
        const chat = await this.chatRepository.findOne({
            where: { id: chatId },
            relations: ['participants'],
        });
    
        if (!chat) {
            throw new NotFoundException('Chat not found');
        }
    
        const isParticipant = chat.participants.some(p => p.id === userId);
        if (!isParticipant) {
            throw new ForbiddenException('You are not a participant of this chat');
        }
    
        await this.chatRepository.remove(chat);
    }

    async getChatMessages(
        chatId: number,
        userId: number,
        offset: number,
        limit: number
      ) {
        const chat = await this.chatRepository.findOne({
          where: { id: chatId },
          relations: ['participants'],
        });
      
        if (!chat) throw new NotFoundException('Чат не найден');
      
        const isParticipant = chat.participants.some(u => u.id === userId);
        if (!isParticipant) {
          throw new ForbiddenException('Вы не участник этого чата');
        }
      
        const messages = await this.messageRepository.find({
          where: { chat: { id: chatId } },
          relations: ['sender'],
          order: { createdAt: 'DESC' },
          skip: offset,
          take: limit,
        });
      
        return messages
          .reverse()
          .map(msg => ({
            id: msg.id,
            text: msg.text,
            sender: msg.sender.id === userId ? 'me' : 'other',
            time: msg.createdAt,
            isRead: msg.isRead,
          }));
      }
      

    async markMessagesAsRead(chatId: number, userId: number) {
        const unreadMessages = await this.messageRepository.find({
            where: {
                chat: { id: chatId },
                sender: { id: Not(userId) },
                isRead: false,
            },
            relations: ['chat', 'sender', 'recipient'],
        });
    
        if (unreadMessages.length > 0) {
            await this.messageRepository
                .createQueryBuilder()
                .update(Message)
                .set({ isRead: true })
                .where("chatId = :chatId", { chatId })
                .andWhere("senderId != :userId", { userId })
                .andWhere("isRead = false")
                .execute();
        }
    
        return unreadMessages;
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

        const recipient = chat.participants.find(p => p.id !== senderId);
        if (!recipient) {
            throw new NotFoundException('Recipient not found for this chat');
        }

        const message = this.messageRepository.create({
            chat,
            sender,
            recipient,
            text,
        });

        await this.messageRepository.save(message);

        return {
            id: message.id,
            chatId: chat.id,
            senderId: sender.id,
            recipientId: recipient.id,
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
