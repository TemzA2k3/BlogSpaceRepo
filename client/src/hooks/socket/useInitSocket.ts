import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

import { useAppSelector } from "@/hooks/redux/reduxHooks";
import { API_BASE_URL } from "@/shared/constants/urls";
import { webSocketSettings } from "@/shared/constants/websockets";
import { useAlert } from "@/app/providers/alert/AlertProvider";

export const useInitSocket = () => {
    const { currentUser } = useAppSelector(state => state.auth);
    const { showAlert } = useAlert();

    const [connected, setConnected] = useState(false);
    const [usersStatus, setUsersStatus] = useState<Record<number, boolean>>({});

    const socketRef = useRef<Socket | null>(null);
    const alertShownRef = useRef(false);

    const setUserStatus = (userId: number, online: boolean) => {
        setUsersStatus(prev => ({ ...prev, [userId]: online }));
    };

    useEffect(() => {
        if (!currentUser && socketRef.current) return;

        const socket = io(API_BASE_URL, webSocketSettings);
        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
            alertShownRef.current = false;
        });

        socket.on("disconnect", (reason) => {
            setConnected(false);

            if (!alertShownRef.current) {
                showAlert(`Соединение потеряно: ${reason}`, "error");
                alertShownRef.current = true;
            }
        });

        socket.on("connect_error", (err) => {
            if (!alertShownRef.current) {
                showAlert(`Ошибка подключения: ${err.message}`, "error");
                alertShownRef.current = true;
            }
        });

        socket.on("error", (err) => {
            if (!alertShownRef.current) {
                showAlert(err?.message || "Ошибка сокета", "error");
                alertShownRef.current = true;
            }
        });

        socket.on("initialOnlineUsers", (ids: number[]) => {
            const map: Record<number, boolean> = {};
            ids.forEach(id => map[id] = true);
            setUsersStatus(map);
        });

        socket.on("userStatusChanged", ({ userId, online }) => {
            setUserStatus(userId, online);
        });

        return () => {
            if (currentUser){
                socket.disconnect();
            }
        }
    }, [currentUser]);

    return {
        socket: socketRef.current,
        connected,
        usersStatus,
        setUserStatus
    };
};
