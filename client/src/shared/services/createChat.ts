import { apiRequest } from "../api/apiClient";

import type { ChatUser } from "../types/chat.types";

export const createChat = async (targetUserId: string | number) => {
    try {
        const data = await apiRequest<ChatUser>(`/chat`, "POST", {
            credentials: "include",
            body: {
                targetUserId
            }
        });

        return data as ChatUser;
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...")
    }
}