import { useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';

import { formatTime } from '@/shared/utils/timeFormatter';

import type { ChatUser, ChatMessage } from '@/shared/types/chat.types';

interface UseChatSocketProps {
    socket: Socket | null;
    currentUserId: number | null;
    selectedUser: ChatUser | null;
    setMessages: React.Dispatch<React.SetStateAction<Record<number, ChatMessage[]>>>;
    setUsersList: React.Dispatch<React.SetStateAction<ChatUser[]>>;
}

export const useChatSocket = ({
    socket,
    currentUserId,
    selectedUser,
    setMessages,
    setUsersList,
}: UseChatSocketProps) => {

    useEffect(() => {
        if (!socket || !selectedUser) return;
        socket.emit('joinChat', selectedUser.chatId);
    }, [socket, selectedUser]);

    useEffect(() => {
        if (!socket) return;

        const handler = (msgFromServer: any) => {
            const formatted: ChatMessage = {
                id: msgFromServer.id,
                text: msgFromServer.text,
                sender: msgFromServer.senderId === currentUserId ? 'me' : 'other',
                time: msgFromServer.createdAt,
                isRead: selectedUser?.chatId === msgFromServer.chatId, // если чат открыт — прочитано
            };

            // Обновляем сообщения
            setMessages(prev => ({
                ...prev,
                [msgFromServer.chatId]: [...(prev[msgFromServer.chatId] || []), formatted],
            }));

            // Обновляем список пользователей
            setUsersList(prev =>
                prev.map(user => {
                    if (user.chatId === msgFromServer.chatId) {
                        return {
                            ...user,
                            lastMessage: msgFromServer.text,
                            time: msgFromServer.createdAt,
                            unread:
                                selectedUser?.chatId === msgFromServer.chatId
                                    ? 0
                                    : (user.unread || 0) + 1,
                        };
                    }
                    return user;
                })
            );            

            // Если чат открыт, уведомляем сервер, что сообщение прочитано
            if (selectedUser?.chatId === msgFromServer.chatId) {
                socket?.emit('markAsRead', {
                    chatId: msgFromServer.chatId,
                    userId: currentUserId,
                });
            }
        };




        socket.on('newMessage', handler);
        return () => {
            socket.off('newMessage', handler);
        };
    }, [socket, currentUserId, setMessages, setUsersList]);

    const sendMessage = useCallback(
        (text: string) => {
            if (!socket || !selectedUser || !currentUserId) return;
            socket.emit('sendMessage', {
                chatId: selectedUser.chatId,
                senderId: currentUserId,
                text,
            });

            setUsersList(prev =>
                prev.map(user => {
                    if (user.chatId === selectedUser.chatId) {
                        return {
                            ...user,
                            lastMessage: text,
                            time: formatTime(new Date()),
                        };
                    }
                    return user;
                })
            );
        }, [socket, selectedUser, currentUserId]
    );

    return { sendMessage };
};
