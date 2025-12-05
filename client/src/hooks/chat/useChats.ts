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

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);


    const handleSelectUser = (user: ChatUser) => {
        setLoading(true);
        if (socket && currentUserId && selectedUser?.chatId && user.chatId !== selectedUser.chatId) {
            socket.emit("leaveChat", selectedUser.chatId);
        }

        setSelectedUser(user);
        setSearchParams({ chat_id: String(user.chatId) });

        setUsersList(prev =>
            prev.map(u =>
                u.chatId === user.chatId ? { ...u, unread: 0 } : u
            )
        );

        if (socket && currentUserId) {
            socket.emit("markAsRead", { chatId: user.chatId, userId: currentUserId });
        }

        socket?.emit("joinChat", user.chatId);
        setLoading(false);
    };

    useEffect(() => {
        if (!usersList.length) return;
        const chatIdParam = searchParams.get('chat_id');
        if (!chatIdParam) return;

        const found = usersList.find(u => u.chatId === Number(chatIdParam));
        if (found) setSelectedUser(found);
    }, [usersList, searchParams]);


    useEffect(() => {
        if (!socket || !currentUserId) return;

        const handler = (newChat: ChatUser) => {
            console.log('newChat', newChat);

            setUsersList(prev => {
                const exists = prev.some(u => u.chatId === newChat.chatId);

                if (!exists) return [...prev, newChat];

                return prev.map(u =>
                    u.chatId === newChat.chatId
                        ? { ...u, ...newChat }
                        : u
                );
            });
        };

        socket.on("newChat", handler);
        return () => {
            socket.off("newChat", handler);
        }

    }, [socket, currentUserId]);


    useEffect(() => {
        if (!socket || !currentUserId) return;

        const handler = (updatedChat: ChatUser) => {
            console.log("chatUnread", updatedChat);

            setUsersList(prev =>
                prev.map(u =>
                    u.chatId === updatedChat.chatId
                        ? { ...u, ...updatedChat }
                        : u
                )
            );
        };

        socket.on("chatUnread", handler);
        return () => {
            socket.off("chatUnread", handler);
        }

    }, [socket, currentUserId]);


    useEffect(() => {
        return () => {
            if (socket && selectedUser?.chatId) {
                socket.emit("leaveChat", selectedUser.chatId);
            }
        };
    }, [socket, selectedUser?.chatId]);


    return {
        usersList,
        selectedUser,
        loading,
        setUsersList,
        handleSelectUser,
    };
};
