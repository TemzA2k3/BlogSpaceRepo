import { useEffect } from "react";

import type { UseTypingStatusProps } from "@/shared/types/socket.types"

export const useTypingStatus = ({ socket, setUsersList }: UseTypingStatusProps) => {
    useEffect(() => {
        if (!socket) return;

        const handleTyping = ({ userId, typing }: { userId: number; typing: boolean }) => {
            setUsersList(prev =>
                prev.map(user =>
                    user.id === userId ? { ...user, typing } : user
                )
            );
        };

        socket.on("userTyping", handleTyping);

        return () => {
            socket.off("userTyping", handleTyping);
        };
    }, [socket, setUsersList]);
};
