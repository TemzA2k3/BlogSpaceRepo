import { useState, useEffect, useCallback } from 'react';

import { useAlert } from '@/app/providers/alert/AlertProvider';
import { getChatNesasges } from '@/shared/services/getChatMessages';

import type { ChatMessage, ChatUser } from '@/shared/types/chat.types';

export const useChatMessages = (selectedUser: ChatUser | null) => {
  const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({});
  const { showAlert } = useAlert();

  const fetchMessagesForCurrentChat = useCallback(
    async (chatId: number) => {
      if (!selectedUser) return;
      try {
        const data = await getChatNesasges(chatId);
        setMessages(prev => ({
          ...prev,
          [selectedUser.chatId]: data,
        }));
      } catch (err: any) {
        showAlert(err.message || 'Ошибка загрузки сообщений', 'error');
      }
    },
    [selectedUser, showAlert]
  );

  useEffect(() => {
    if (!selectedUser) return;
    const chatId = selectedUser.chatId;
    if (!messages[chatId]) fetchMessagesForCurrentChat(chatId);
  }, [selectedUser, messages, fetchMessagesForCurrentChat]);

  return { messages, setMessages, fetchMessagesForCurrentChat };
};
