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
import { ChatService } from './chat.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatService) { }

    handleConnection(client: Socket) {
        console.log('client connected', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('client disconnected', client.id);
    }

    @SubscribeMessage('joinChat')
    async onJoin(
        @MessageBody() chatId: number,
        @ConnectedSocket() client: Socket
    ) {
        client.join(`chat_${chatId}`);
    }

    @SubscribeMessage('sendMessage')
    async sendMessage(
        @MessageBody() payload: { chatId: number; senderId: number; text: string },
        @ConnectedSocket() client: Socket
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
    async markAsRead(
        @MessageBody() payload: { chatId: number; userId: number }
    ) {
        await this.chatService.markMessagesAsRead(payload.chatId, payload.userId);
    }

}

