// src/app/providers/socket/SocketContext.ts
import { createContext, useContext } from "react";
import type { Socket } from "socket.io-client";

export interface SocketContextType {
    socket: Socket | null;
    connected: boolean;
    usersStatus: Record<number, boolean>;
    setUserStatus: (id: number, online: boolean) => void;
}

const defaultValue: SocketContextType = {
    socket: null,
    connected: false,
    usersStatus: {},
    setUserStatus: () => {},
};

export const SocketContext = createContext<SocketContextType>(defaultValue);

export const useSocketContext = () => useContext(SocketContext);
