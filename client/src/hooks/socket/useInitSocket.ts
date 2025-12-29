import { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";
import { useTranslation } from "react-i18next";

import { useAlert } from "@/app/providers/alert/AlertProvider";

import { useAppSelector } from "@/hooks/redux/reduxHooks";

import { getSocket, disconnectSocket } from "./socket";

export const useInitSocket = () => {
    const { t } = useTranslation();
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
                showAlert(t("socket.connectionLost", { reason }), "error");
                alertShownRef.current = true;
            }
        };

        const onConnectError = (err: Error) => {
            if (!alertShownRef.current) {
                showAlert(t("socket.connectionError", { message: err.message }), "error");
                alertShownRef.current = true;
            }
        };

        const onSocketError = (err: any) => {
            if (!alertShownRef.current) {
                showAlert(err?.message || t("socket.socketError"), "error");
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
    }, [currentUser, showAlert, t]);

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
        setUserStatus: (userId: number, online: boolean) => {
            setUsersStatus(prev => ({ ...prev, [userId]: online }));
        },
    };
};