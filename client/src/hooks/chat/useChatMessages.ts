import { useState, useEffect, useCallback } from 'react';
import { useAlert } from '@/app/providers/alert/AlertProvider';
import { getChatMessages } from '@/shared/services/getChatMessages';
import type { ChatMessage, ChatUser } from '@/shared/types/chat.types';

export const useChatMessages = (selectedUser: ChatUser | null) => {
    const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({});
    const [fetchBlocked, setFetchBlocked] = useState(false);
    const { showAlert } = useAlert();

    const fetchMessagesForCurrentChat = useCallback(
        async (chatId: number) => {
            if (!selectedUser || fetchBlocked) return;

            try {
                const data = await getChatMessages(chatId);

                setMessages(prev => {
                    const localMessages = prev[chatId] || [];
                    const allMessagesMap = new Map<number, ChatMessage>();
                    [...data, ...localMessages].forEach(msg => allMessagesMap.set(msg.id, msg));
                    return {
                        ...prev,
                        [chatId]: Array.from(allMessagesMap.values()).sort(
                            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
                        ),
                    };
                });
            } catch (err: any) {
                console.error(err);
                showAlert(err.message || 'Ошибка загрузки сообщений', 'error');

                if (!navigator.onLine) {
                    setFetchBlocked(true);
                }
            }
        },
        [selectedUser, fetchBlocked, showAlert]
    );

    useEffect(() => {
        if (!selectedUser) return;
        fetchMessagesForCurrentChat(selectedUser.chatId);
    }, [selectedUser?.chatId]);

    return { messages, setMessages, fetchMessagesForCurrentChat };
};
