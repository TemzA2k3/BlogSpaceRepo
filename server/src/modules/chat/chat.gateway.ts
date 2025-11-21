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

@WebSocketGateway({ cors: true })
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatService) { }

    // Подключение клиента
    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    // Отправка сообщения
    // Отправка сообщения
    @SubscribeMessage('sendMessage')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { chatId: number; text: string; senderId: number }
    ) {
        const message = await this.chatService.createMessage(
            payload.chatId,
            payload.senderId,
            payload.text
        );

        // Получаем чат
        const chat = await this.chatService.getChatById(payload.chatId);

        if (!chat) {
            // Если чат не найден — выбрасываем исключение
            throw new Error('Chat not found');
        }

        // Отправляем всем участникам чата новое сообщение
        chat.participants.forEach(user => {
            this.server.to(`user_${user.id}`).emit('newMessage', message);
        });

        return message;
    }


    @SubscribeMessage('join')
    handleJoin(
        @ConnectedSocket() client: Socket,
        @MessageBody() userId: number
    ) {
        client.join(`user_${userId}`);
        console.log(`User ${userId} joined their personal room`);
    }
}
