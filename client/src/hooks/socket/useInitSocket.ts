import { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";

import { useAppSelector } from "@/hooks/redux/reduxHooks";
import { useAlert } from "@/app/providers/alert/AlertProvider";
import { getSocket, disconnectSocket } from "./socket";

export const useInitSocket = () => {
    const { currentUser } = useAppSelector(state => state.auth);
    const { showAlert } = useAlert();

    const [connected, setConnected] = useState(false);
    const [usersStatus, setUsersStatus] = useState<Record<number, boolean>>({});

    const alertShownRef = useRef(false);

    useEffect(() => {
        if (!currentUser) return;

        const socket: Socket = getSocket();

        const onConnect = () => {
            setConnected(true);
            alertShownRef.current = false;
        };

        const onDisconnect = (reason: string) => {
            setConnected(false);

            if (!alertShownRef.current) {
                showAlert(`Соединение потеряно: ${reason}`, "error");
                alertShownRef.current = true;
            }
        };

        const onConnectError = (err: Error) => {
            if (!alertShownRef.current) {
                showAlert(`Ошибка подключения: ${err.message}`, "error");
                alertShownRef.current = true;
            }
        };

        const onSocketError = (err: any) => {
            if (!alertShownRef.current) {
                showAlert(err?.message || "Ошибка сокета", "error");
                alertShownRef.current = true;
            }
        };

        const onInitialUsers = (ids: number[]) => {
            const map: Record<number, boolean> = {};
            ids.forEach(id => (map[id] = true));
            setUsersStatus(map);
        };

        const onUserStatusChanged = ({ userId, online }: { userId: number; online: boolean }) => {
            setUsersStatus(prev => ({ ...prev, [userId]: online }));
        };

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onConnectError);
        socket.on("error", onSocketError);
        socket.on("initialOnlineUsers", onInitialUsers);
        socket.on("userStatusChanged", onUserStatusChanged);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onConnectError);
            socket.off("error", onSocketError);
            socket.off("initialOnlineUsers", onInitialUsers);
            socket.off("userStatusChanged", onUserStatusChanged);
        };
    }, [currentUser, showAlert]);

    useEffect(() => {
        if (!currentUser) {
            setConnected(false);
            setUsersStatus({});
            disconnectSocket();
        }
    }, [currentUser]);

    return {
        socket: currentUser ? getSocket() : null,
        connected,
        usersStatus,
    };
};
