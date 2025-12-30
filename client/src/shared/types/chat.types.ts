import { Socket } from "socket.io-client";

import type { UserCardProps } from "./user.types";

export interface ChatUser {
    id: number;
    chatId: number;
    firstName: string;
    lastName: string;
    avatar: string | null;
    lastMessage: string | null;
    time: string | null;
    unread: number;
    online: boolean;
    typing?: boolean
}

export interface ChatMessage {
    id: number;
    text: string;
    sender: 'me' | 'other';
    time: string;
    isRead: boolean;
}

export interface UsersListProps {
    users: ChatUser[];
    setUsers: React.Dispatch<React.SetStateAction<ChatUser[]>>;
    selectedUser: ChatUser | null;
    setSelectedUser: (user: ChatUser) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export interface ModalContentUsersListProps {
    fetchData: (offset: number, limit: number) => Promise<UserCardProps[]>;
    title?: string;
    blankIcon?: string;
    blankTitle?: string;
    blankMessage?: string;
    onChatCreated?: (user: ChatUser) => void;
}

export interface ChatInputProps {
    socket: Socket | null;
    currentUserId: number | null;
    selectedUserId: number | null;
    onSend: (text: string) => void;
}

export interface ChatHeaderProps {
    firstName: string;
    lastName: string;
    avatar: string | null;
    online: boolean;
    typing?: boolean;
    onDeleteChat?: () => void;
    deleting?: boolean;
    onBack?: () => void;
}

export interface ChatMessageProps {
    msg: ChatMessage;
    selectedUser: any;
    markMessageAsRead?: (msg: ChatMessage) => void;
}

export interface ChatMessagesProps {
    messages: ChatMessage[];
    selectedUser: ChatUser;
    markMessageAsRead?: (msg: ChatMessage) => void;
    fetchMoreMessages: () => void;
    hasMore: boolean;
}