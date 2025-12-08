import { apiRequest } from "../api/apiClient";

import type { ChatUser } from "../types/chat.types";

export const getAllChats = async () => {
    try {
        const data = await apiRequest<ChatUser[]>(`/chat`, "GET", {
            credentials: "include",
        });

        return data || [];
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...")
    }
}