import { useState, type KeyboardEvent } from "react";

import type { ChatInputProps } from "@/shared/types/chat.types";

export const useChatInput = ({ socket, currentUserId, selectedUserId, onSend }: ChatInputProps) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text.trim());
    setText("");

    if (socket && currentUserId && selectedUserId) {
      socket.emit("stopTyping", { userId: currentUserId, chatWithId: selectedUserId });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return {
    text,
    setText,
    handleSend,
    handleKeyDown,
  };
};
