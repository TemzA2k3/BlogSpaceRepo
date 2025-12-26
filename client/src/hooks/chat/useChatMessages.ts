import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useAlert } from "@/app/providers/alert/AlertProvider";

import { getChatMessages } from "@/shared/services/getChatMessages";
import type { ChatMessage, ChatUser } from "@/shared/types/chat.types";

const MESSAGES_LIMIT = 30;

export const useChatMessages = (selectedUser: ChatUser | null) => {
    const { t } = useTranslation();
    const { showAlert } = useAlert();

    const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({});
    const [offsets, setOffsets] = useState<Record<number, number>>({});
    const [hasMore, setHasMore] = useState<Record<number, boolean>>({});
    const [loading, setLoading] = useState<Record<number, boolean>>({});

    const fetchInitialMessages = useCallback(async (chatId: number) => {
        try {
            setLoading(prev => ({ ...prev, [chatId]: true }));

            const data = await getChatMessages(chatId, 0, MESSAGES_LIMIT);

            setMessages(prev => ({ ...prev, [chatId]: data }));
            setOffsets(prev => ({ ...prev, [chatId]: data.length }));
            setHasMore(prev => ({ ...prev, [chatId]: data.length === MESSAGES_LIMIT }));
        } catch (e: any) {
            showAlert(e.message || t("chat.messagesLoadError"), "error");
        } finally {
            setLoading(prev => ({ ...prev, [chatId]: false }));
        }
    }, [t]);

    const fetchMoreMessages = useCallback(async () => {
        if (!selectedUser) return;

        const chatId = selectedUser.chatId;
        const offset = offsets[chatId] ?? 0;

        if (loading[chatId] || hasMore[chatId] === false) return;

        try {
            setLoading(prev => ({ ...prev, [chatId]: true }));

            const data = await getChatMessages(chatId, offset, MESSAGES_LIMIT);

            setMessages(prev => ({
                ...prev,
                [chatId]: [...data, ...(prev[chatId] || [])],
            }));

            setOffsets(prev => ({ ...prev, [chatId]: offset + data.length }));
            setHasMore(prev => ({ ...prev, [chatId]: data.length === MESSAGES_LIMIT }));
        } catch (e: any) {
            showAlert(e.message || t("chat.messagesLoadError"), "error");
        } finally {
            setLoading(prev => ({ ...prev, [chatId]: false }));
        }
    }, [selectedUser, offsets, loading, hasMore, t]);

    useEffect(() => {
        if (!selectedUser) return;

        const chatId = selectedUser.chatId;

        if (!messages[chatId]) {
            fetchInitialMessages(chatId);
        }
    }, [selectedUser?.chatId]);

    return {
        messages,
        fetchMoreMessages,
        setMessages,
        loading: selectedUser ? loading[selectedUser.chatId] : false,
        hasMore: selectedUser ? hasMore[selectedUser.chatId] : false,
    };
};