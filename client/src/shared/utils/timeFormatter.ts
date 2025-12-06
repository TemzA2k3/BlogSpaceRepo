import type { ChatMessage } from "@/shared/types/chat.types";

export const formatTime = (dateStr: string | Date | null) => {
    if (!dateStr) return ""
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

export const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
};

export const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: Record<string, ChatMessage[]> = {};

    messages.forEach(msg => {
        const date = new Date(msg.time);
        const key = date.toISOString().split("T")[0];

        if (!groups[key]) groups[key] = [];
        groups[key].push(msg);
    });

    return groups;
};
