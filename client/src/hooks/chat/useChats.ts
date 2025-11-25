import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import { getAllChats } from '@/shared/services/fetchUserChats';

import type { ChatUser } from '@/shared/types/chat.types';

export const useChats = (socket: Socket | null, currentUserId: number | null) => {
    const [usersList, setUsersList] = useState<ChatUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const fetchChats = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllChats();
            setUsersList(data || []);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSelectUser = (user: ChatUser) => {
        setSelectedUser(user);
        setSearchParams({ chat_id: String(user.chatId) });

        setUsersList(prev =>
            prev.map(u =>
                u.chatId === user.chatId
                    ? { ...u, unread: 0 }
                    : u
            )
        );

        if (socket && currentUserId) {
            socket.emit('markAsRead', { chatId: user.chatId, userId: currentUserId });
        }
    };

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    useEffect(() => {
        if (!usersList.length) return;
        const chatIdParam = searchParams.get('chat_id');
        if (!chatIdParam) return;
        const found = usersList.find(u => u.chatId === Number(chatIdParam));
        if (found) setSelectedUser(found);
    }, [usersList, searchParams]);

    return {
        usersList,
        selectedUser,
        loading,
        setUsersList,
        handleSelectUser,
    };
};