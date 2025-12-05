import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway({
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
        credentials: true,
    },
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private onlineUsers = new Map<number, string>();
    private activeChat = new Map<number, number>();
    private unreadCounts = new Map<number, Map<number, number>>();

    constructor(
        private readonly chatService: ChatService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    private extractUserId(client: Socket): number | null {
        try {
            const cookie = client.handshake.headers.cookie;
            if (!cookie) return null;

            const match = cookie.match(/access_token=([^;]+)/);
            if (!match) return null;

            const token = match[1];
            const payload = this.jwtService.verify(token);

            return payload.userId || null;
        } catch {
            return null;
        }
    }

    handleConnection(client: Socket) {
        const userId = this.extractUserId(client);
        if (!userId) return client.disconnect();

        this.onlineUsers.set(userId, client.id);
        client.join(`user_${userId}`);

        if (!this.unreadCounts.has(userId)) {
            this.unreadCounts.set(userId, new Map());
        }

        this.server.emit('userStatusChanged', { userId, online: true });
        client.emit("initialOnlineUsers", Array.from(this.onlineUsers.keys()));
    }

    handleDisconnect(client: Socket) {
        const entry = [...this.onlineUsers.entries()]
            .find(([_, sid]) => sid === client.id);

        if (!entry) return;

        const userId = entry[0];

        this.onlineUsers.delete(userId);
        this.activeChat.delete(userId);

        this.server.emit('userStatusChanged', { userId, online: false });
    }

    @SubscribeMessage('joinChat')
    onJoin(
        @MessageBody() chatId: number,
        @ConnectedSocket() client: Socket
    ) {
        const userId = this.extractUserId(client);
        if (!userId) return;

        client.join(`chat_${chatId}`);

        this.activeChat.set(userId, chatId);

        if (!this.unreadCounts.has(userId))
            this.unreadCounts.set(userId, new Map());

        this.unreadCounts.get(userId)!.set(chatId, 0);
    }

    @SubscribeMessage('leaveChat')
    onLeaveChat(
        @MessageBody() chatId: number,
        @ConnectedSocket() client: Socket
    ) {
        const userId = this.extractUserId(client);
        if (!userId) return;

        const active = this.activeChat.get(userId);
        if (active === chatId) {
            this.activeChat.delete(userId);
        }
    }

    @SubscribeMessage('sendMessage')
    async sendMessage(
        @MessageBody()
        payload: { chatId: number; senderId: number; recipientId: number; text: string }
    ) {
        const { chatId, senderId, recipientId, text } = payload;

        const savedMessage = await this.chatService.createMessage(chatId, senderId, text);

        this.server.to(`chat_${chatId}`).emit("newMessage", savedMessage);

        const sender = await this.usersService.findOneByParams({ id: senderId });

        if (!this.unreadCounts.has(recipientId))
            this.unreadCounts.set(recipientId, new Map());

        const userUnread = this.unreadCounts.get(recipientId)!;

        const isActive = this.activeChat.get(recipientId) === chatId;
        const prevUnread = userUnread.get(chatId) ?? 0;

        const unread = isActive ? 0 : prevUnread + 1;

        userUnread.set(chatId, unread);

        const chatPayload = {
            id: sender.id,
            chatId,
            firstName: sender.firstName,
            lastName: sender.lastName,
            avatar: sender.avatar,
            lastMessage: savedMessage.text,
            time: savedMessage.createdAt,
            online: this.onlineUsers.has(sender.id),
            unread
        };

        if (isActive) {
            this.server.to(`user_${recipientId}`).emit("chatUnread", chatPayload);
        } else {
            this.server.to(`user_${recipientId}`).emit("newChat", chatPayload);
        }
    }

    @SubscribeMessage('markAsRead')
    async markAsRead(
        @MessageBody() payload: { chatId: number; userId: number }
    ) {
        const { chatId, userId } = payload;

        const readMessages = await this.chatService.markMessagesAsRead(chatId, userId);

        if (!this.unreadCounts.has(userId))
            this.unreadCounts.set(userId, new Map());

        this.unreadCounts.get(userId)!.set(chatId, 0);

        this.activeChat.set(userId, chatId);

        readMessages.forEach(msg => {
            const socketId = this.onlineUsers.get(userId);
            if (socketId) {
                this.server
                    .to(`chat_${chatId}`)
                    .except(socketId)
                    .emit('messageRead', {
                        chatId,
                        messageIds: [msg.id],
                    });
            } else {
                this.server.to(`chat_${chatId}`).emit('messageRead', {
                    chatId,
                    messageIds: [msg.id],
                });
            }
        });
    }

    @SubscribeMessage('typing')
    handleTyping(@MessageBody() payload: { userId: number }) {
        const { userId } = payload;
        this.server.emit('userTyping', { userId, typing: true });
    }

    @SubscribeMessage('stopTyping')
    handleStopTyping(@MessageBody() payload: { userId: number }) {
        const { userId } = payload;
        this.server.emit('userTyping', { userId, typing: false });
    }

}
