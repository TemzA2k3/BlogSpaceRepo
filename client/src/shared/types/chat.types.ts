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
    fetchData: () => Promise<UserCardProps[]>;
    title?: string;
    blankIcon?: string;
    blankTitle?: string;
    blankMessage?: string;
    onChatCreated?: (user: ChatUser) => void;
}

export interface ChatMessageProps {
    msg: ChatMessage;
    selectedUser: ChatUser;
}
