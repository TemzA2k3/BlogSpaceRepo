import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import type { ChatMessage } from '@/shared/types/chat.types';

interface UseMessageSocketParams {
    socket: Socket | null;
    currentUserId: number | null;
    selectedChatId: number | null;
    setMessages: React.Dispatch<React.SetStateAction<Record<number, ChatMessage[]>>>;
}

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
