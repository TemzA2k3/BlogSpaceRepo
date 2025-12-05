import { useEffect } from "react";
import { Socket } from "socket.io-client";
import type { ChatUser } from '@/shared/types/chat.types';

interface UseTypingStatusProps {
  socket: Socket | null;
  setUsersList: React.Dispatch<React.SetStateAction<ChatUser[]>>;
}

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
