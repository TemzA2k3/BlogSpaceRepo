import { createContext, useContext } from "react";

import type { SocketContextType } from "@/shared/types/socket-context.types";

const defaultValue: SocketContextType = {
    socket: null,
    connected: false,
    usersStatus: {},
    setUserStatus: () => { },
};

export const SocketContext = createContext<SocketContextType>(defaultValue);

export const useSocketContext = () => useContext(SocketContext);
