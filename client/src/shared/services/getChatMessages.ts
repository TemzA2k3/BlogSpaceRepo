import { apiRequest } from "@/shared/api/apiClient";

import type { ChatMessage } from "@/shared/types/chat.types"

export const getChatMessages = async (
    chatId: number,
    offset: number,
    limit: number
  ) => {
    const data = await apiRequest<ChatMessage[]>(
      `/chat/${chatId}/messages?offset=${offset}&limit=${limit}`,
      "GET",
      { credentials: "include" }
    );
  
    return data || [];
  };