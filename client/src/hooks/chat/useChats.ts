import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import { getAllChats, deleteChat } from '@/shared/services/chatService';
import { useDebounce } from '@/hooks/debounce/useDebounce';
import type { ChatUser } from '@/shared/types/chat.types';

import { CHATS_LIMIT } from '@/shared/constants/chats.limit';

export const useChats = (socket: Socket | null, currentUserId: number | null) => {
    const [usersList, setUsersList] = useState<ChatUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searching, setSearching] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    const debouncedSearch = useDebounce(searchQuery, 500);
    const offsetRef = useRef(0);
    const isFirstLoad = useRef(true);

    const fetchChats = useCallback(async (offset: number, isInitial = false, search?: string) => {
        try {
            if (isInitial) {
                if (isFirstLoad.current) {
                    setLoading(true);
                } else {
                    setSearching(true);
                }
            } else {
                setLoadingMore(true);
            }

            const data = await getAllChats(offset, CHATS_LIMIT, search);

            if (isInitial) {
                setUsersList(data);
            } else {
                setUsersList(prev => [...prev, ...data]);
            }

            setHasMore(data.length === CHATS_LIMIT);
            offsetRef.current = offset + data.length;
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setSearching(false);
            isFirstLoad.current = false;
        }
    }, []);

    useEffect(() => {
        offsetRef.current = 0;
        fetchChats(0, true, debouncedSearch || undefined);
    }, [fetchChats, debouncedSearch]);

    const fetchMoreChats = useCallback(() => {
        if (!loadingMore && hasMore) {
            fetchChats(offsetRef.current, false, debouncedSearch || undefined);
        }
    }, [fetchChats, loadingMore, hasMore, debouncedSearch]);

    const handleSelectUser = (user: ChatUser | null) => {
        if (socket && currentUserId && selectedUser?.chatId && user?.chatId !== selectedUser.chatId) {
            socket.emit("leaveChat", selectedUser.chatId);
        }

        setSelectedUser(user);

        if (user) {
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
        } else {
            setSearchParams({});
        }
    };

    const handleDeleteChat = useCallback(async () => {
        if (!selectedUser?.chatId) return;

        setDeleting(true);

        try {
            await deleteChat(selectedUser.chatId);

            if (socket) {
                socket.emit("leaveChat", selectedUser.chatId);
            }

            setUsersList(prev => prev.filter(u => u.chatId !== selectedUser.chatId));

            setSelectedUser(null);
            setSearchParams({});
        } catch (error) {
            throw error;
        } finally {
            setDeleting(false);
        }
    }, [selectedUser, socket, setSearchParams]);

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
            setUsersList(prev => {
                const exists = prev.some(u => u.chatId === newChat.chatId);

                if (!exists) return [newChat, ...prev];

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
        };
    }, [socket, currentUserId]);

    useEffect(() => {
        if (!socket || !currentUserId) return;

        const handler = (updatedChat: ChatUser) => {
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
        };
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
        loadingMore,
        searching,
        deleting,
        hasMore,
        searchQuery,
        setSearchQuery,
        setUsersList,
        handleSelectUser,
        handleDeleteChat,
        fetchMoreChats,
    };
};