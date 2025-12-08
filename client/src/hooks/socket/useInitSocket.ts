import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { useAppSelector } from "@/hooks/redux/reduxHooks";

import { API_BASE_URL } from "@/shared/constants/urls";
import type { SocketContextType } from "@/shared/types/socket-context.types";

import { useAlert } from "@/app/providers/alert/AlertProvider";

import { webSocketSettings } from "@/shared/constants/websockets";

export const useInitSocket = (): SocketContextType => {
    const { loading, currentUser } = useAppSelector(state => state.auth);
    const { showAlert } = useAlert();

    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const [usersStatus, setUsersStatus] = useState<Record<number, boolean>>({});
    const [alertShown, setAlertShown] = useState(false);

    const setUserStatus = (userId: number, online: boolean) => {
        setUsersStatus(prev => ({ ...prev, [userId]: online }));
    };

    useEffect(() => {
        // Если пользователь не залогинен или ещё идёт загрузка, сокет не создаём
        if (loading || !currentUser) return;

        const newSocket = io(API_BASE_URL, webSocketSettings);
        setSocket(newSocket);

        newSocket.on("connect", () => {
            setConnected(true);
            if (alertShown) setAlertShown(false); // соединение восстановлено, можно показывать алерты снова
        });

        newSocket.on("disconnect", (reason) => {
            setConnected(false);
            if (!alertShown) {
                showAlert(`Соединение потеряно: ${reason}`, "error");
                setAlertShown(true);
            }
        });

        newSocket.on("connect_error", (err) => {
            if (!alertShown) {
                showAlert(`Ошибка подключения: ${err.message}`, "error");
                setAlertShown(true);
            }
        });

        newSocket.on("error", (err) => {
            if (!alertShown) {
                showAlert(typeof err === "string" ? err : err?.message ?? "Неизвестная ошибка сокета", "error");
                setAlertShown(true);
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [loading, currentUser, showAlert, alertShown]);

    return { socket, connected, usersStatus, setUserStatus };
};
