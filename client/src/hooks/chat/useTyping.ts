import { useEffect } from "react";

import { useDebounce } from "@/hooks/debounce/useDebounce";

import type { UseTypingProps } from "@/shared/types/socket.types"

export const useTyping = ({ text, socket, currentUserId, selectedUserId }: UseTypingProps) => {
    const debouncedText = useDebounce(text, 500);

    useEffect(() => {
        if (!socket || !currentUserId || !selectedUserId) return;
        if (text.trim()) {
            socket.emit("typing", { userId: currentUserId, chatWithId: selectedUserId });
        }
    }, [text, socket, currentUserId, selectedUserId]);

    useEffect(() => {
        if (!socket || !currentUserId || !selectedUserId) return;
        if (!debouncedText.trim()) return;

        const timeout = setTimeout(() => {
            socket.emit("stopTyping", { userId: currentUserId, chatWithId: selectedUserId });
        }, 500);

        return () => clearTimeout(timeout);
    }, [debouncedText, socket, currentUserId, selectedUserId]);
};
