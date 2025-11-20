export interface ChatUser {
    id: number;
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
}
