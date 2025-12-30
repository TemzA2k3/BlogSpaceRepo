import { apiRequest } from "../api/apiClient";

import type { ChatUser } from "../types/chat.types";

export const getAllChats = async (offset = 0, limit = 20, search?: string) => {
    try {
        let url = `/chat?offset=${offset}&limit=${limit}`;
        if (search && search.trim()) {
            url += `&search=${encodeURIComponent(search.trim())}`;
        }
        
        const data = await apiRequest<ChatUser[]>(url, "GET", { credentials: "include" });
        return data || [];
    } catch (err: any) {
        throw new Error(err.message || "Failed to fetch chats");
    }
};

export const deleteChat = async (chatId: number): Promise<void> => {
    await apiRequest(`/chat/${chatId}`, "DELETE", {
        credentials: "include",
    });
};