import { useEffect } from 'react';

import type { ChatMessage } from '@/shared/types/chat.types';
import type { UseMessageSocketParams } from "@/shared/types/socket.types"

export const useMessageSocket = ({
    socket,
    currentUserId,
    selectedChatId,
    setMessages,
}: UseMessageSocketParams) => {

    const markMessageAsRead = (msg: ChatMessage) => {
        if (!socket || !selectedChatId || !currentUserId || msg.isRead) return;

        socket.emit('markAsRead', {
            chatId: selectedChatId,
            userId: currentUserId,
            messageIds: [msg.id],
        });

        setMessages(prev => ({
            ...prev,
            [selectedChatId]: prev[selectedChatId].map(m =>
                m.id === msg.id ? { ...m, isRead: true } : m
            ),
        }));
    };

    useEffect(() => {
        if (!socket) return;

        const handleMessageRead = (data: { chatId: number; messageIds: number[] }) => {
            setMessages(prev => ({
                ...prev,
                [data.chatId]: prev[data.chatId].map(msg =>
                    data.messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
                ),
            }));
        };

        socket.on('messageRead', handleMessageRead);
        return () => {
            socket.off('messageRead', handleMessageRead);
        };
    }, [socket, setMessages]);

    return { markMessageAsRead };
};
