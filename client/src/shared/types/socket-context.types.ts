import { Socket } from "socket.io-client";

export interface SocketContextType {
    socket: Socket | null;
    connected: boolean;
    usersStatus: Record<number, boolean>;
    setUserStatus: (userId: number, online: boolean) => void;
}