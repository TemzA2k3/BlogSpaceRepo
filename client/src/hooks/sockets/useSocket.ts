import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '@/shared/constants/urls';

export const useSocket = (userId: number | null): Socket | null => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket: Socket = io(API_BASE_URL, {
      query: { userId: String(userId) },
    });

    socketRef.current = socket;
    socket.emit('join', userId);

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  // 👇 Явно возвращаем тип Socket | null
  return socketRef.current;
};
