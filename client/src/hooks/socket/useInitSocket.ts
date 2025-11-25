import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "@/hooks/redux/reduxHooks";
import { API_BASE_URL } from "@/shared/constants/urls";
import type { SocketContextType } from "@/shared/types/socket-context.types";

export const useInitSocket = (): SocketContextType => {
    const { loading } = useAppSelector(state => state.auth);

    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const [usersStatus, setUsersStatus] = useState<Record<number, boolean>>({});

    const setUserStatus = (userId: number, online: boolean) => {
        setUsersStatus(prev => ({ ...prev, [userId]: online }));
    };

    useEffect(() => {
        if (loading) return;

        const newSocket = io(API_BASE_URL, {
            withCredentials: true,
            transports: ["websocket"],
        });

        setSocket(newSocket);

        newSocket.on("connect", () => setConnected(true));
        newSocket.on("disconnect", () => setConnected(false));

        newSocket.on("userStatusChanged", ({ userId, online }) => {
            setUserStatus(userId, online);
        });

        newSocket.on("initialOnlineUsers", (ids: number[]) => {
            const map = Object.fromEntries(ids.map(id => [id, true]));
            setUsersStatus(map);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [loading]);

    return { socket, connected, usersStatus, setUserStatus };
};
