import type { Socket } from 'socket.io-client';
import type { ChatUser, ChatMessage } from '@/shared/types/chat.types';

export interface UseChatSocketProps {
    socket: Socket | null;
    currentUserId: number | null;
    selectedUser: ChatUser | null;
    setMessages: React.Dispatch<React.SetStateAction<Record<number, ChatMessage[]>>>;
    setUsersList: React.Dispatch<React.SetStateAction<ChatUser[]>>;
}

export interface UseMessageSocketParams {
    socket: Socket | null;
    currentUserId: number | null;
    selectedChatId: number | null;
    setMessages: React.Dispatch<React.SetStateAction<Record<number, ChatMessage[]>>>;
}

export interface UseTypingProps {
    text: string;
    socket: Socket | null;
    currentUserId: number | null;
    selectedUserId: number | null;
}

export interface UseTypingStatusProps {
    socket: Socket | null;
    setUsersList: React.Dispatch<React.SetStateAction<ChatUser[]>>;
}