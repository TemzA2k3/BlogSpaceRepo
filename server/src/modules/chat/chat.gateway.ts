// chat.gateway.ts
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

    constructor(
        private readonly chatService: ChatService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    handleConnection(client: Socket) {
        console.log('client connected', client.id);

        try {
            const cookie = client.handshake.headers.cookie;
            if (!cookie) return;

            const match = cookie.match(/access_token=([^;]+)/);
            if (!match) return;

            const token = match[1];
            const payload = this.jwtService.verify(token);
            const userId = payload.userId;

            this.onlineUsers.set(userId, client.id);

            this.usersService.setUserOnline(userId);

            this.server.emit('userStatusChanged', { userId, online: true });

            client.emit(
                "initialOnlineUsers",
                Array.from(this.onlineUsers.keys())
            );

        } catch (err) {
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        console.log('client disconnected', client.id);

        const entry = [...this.onlineUsers.entries()].find(([_, socketId]) => socketId === client.id);
        if (!entry) return;

        const userId = entry[0];
        this.onlineUsers.delete(userId);

        this.usersService.setUserOffline(userId);
        this.server.emit('userStatusChanged', { userId, online: false });
    }

    @SubscribeMessage('joinChat')
    async onJoin(@MessageBody() chatId: number, @ConnectedSocket() client: Socket) {
        client.join(`chat_${chatId}`);
    }

    @SubscribeMessage('sendMessage')
    async sendMessage(
        @MessageBody()
        payload: { chatId: number; senderId: number; recipientId: number; text: string }
    ) {
        const savedMessage = await this.chatService.createMessage(
            payload.chatId,
            payload.senderId,
            payload.text
        );

        this.server.to(`chat_${payload.chatId}`).emit('newMessage', savedMessage);
        return savedMessage;
    }

    @SubscribeMessage('markAsRead')
    async markAsRead(@MessageBody() payload: { chatId: number; userId: number }) {
        await this.chatService.markMessagesAsRead(payload.chatId, payload.userId);
    }
}
