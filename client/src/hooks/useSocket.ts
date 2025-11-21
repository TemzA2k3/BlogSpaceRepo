import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

import { API_BASE_URL } from '@/shared/constants/urls';

export const useSocket = (userId: number | null): Socket | null => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!userId) return;

        const socket = io(API_BASE_URL);
        socketRef.current = socket;

        socket.emit('join', userId);

        return () => {
            socket.disconnect();
        };
    }, [userId]);

    return socketRef.current;
};
