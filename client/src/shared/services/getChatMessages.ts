import { apiRequest } from "@/shared/api/apiClient";

import type { ChatMessage } from "@/shared/types/chat.types"


export const getChatMessages = async (chatId: number | null) => {
    if (!chatId) return [];

    try {
        const data = await apiRequest<ChatMessage[]>(`/chat/${chatId}/messages`, "GET", {
            credentials: "include",
        });

        return data || [];
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...")
    }
}