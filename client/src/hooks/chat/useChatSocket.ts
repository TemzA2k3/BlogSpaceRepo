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
    }, [socket, selectedUser?.chatId]);

    useEffect(() => {
        if (!socket) return;


        const handler = (msgFromServer: any) => {
            const isChatOpen = selectedUser?.chatId === msgFromServer.chatId;

            setMessages(prev => ({
                ...prev,
                [msgFromServer.chatId]: [...(prev[msgFromServer.chatId] || []), {
                    id: msgFromServer.id,
                    text: msgFromServer.text,
                    sender: msgFromServer.senderId === currentUserId ? 'me' : 'other',
                    time: msgFromServer.createdAt,
                    isRead: isChatOpen,
                }],
            }));

            setUsersList(prev =>
                prev.map(user => {
                    if (user.chatId === msgFromServer.chatId) {
                        return {
                            ...user,
                            lastMessage: msgFromServer.text,
                            time: msgFromServer.createdAt,
                            unread: isChatOpen ? 0 : (user.unread ?? 0) + 1,
                        };
                    }
                    return { ...user };
                })
            );

            if (isChatOpen) {
                socket.emit('markAsRead', {
                    chatId: msgFromServer.chatId,
                    userId: currentUserId,
                });
            }
        };

        socket.on('newMessage', handler);
        return () => {
            socket.off('newMessage', handler);
        };
    }, [socket, currentUserId, selectedUser, setMessages, setUsersList]);


    const sendMessage = useCallback(
        (text: string) => {
            if (!socket || !selectedUser || !currentUserId) return;
            const chatId = selectedUser.chatId;
            socket.emit('sendMessage', {
                chatId,
                senderId: currentUserId,
                text,
            });

            setUsersList(prev =>
                prev.map(user => {
                    if (user.chatId === chatId) {
                        return {
                            ...user,
                            lastMessage: text,
                            time: formatTime(new Date()),
                        };
                    }
                    return user;
                })
            );
        },
        [socket, selectedUser?.chatId, currentUserId, setUsersList]
    );


    return { sendMessage };
};
