import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/shared/constants/urls";
import { webSocketSettings } from "@/shared/constants/websockets";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(SOCKET_URL, webSocketSettings);
    }
    return socket;
};

export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
};
