import { createContext, useContext, type ReactNode } from "react";
import type { SocketContextType } from "@/shared/types/socket-context.types";
import { useInitSocket } from "@/hooks/socket/useInitSocket";

export const SocketContext = createContext<SocketContextType>({
    socket: null,
    connected: false,
    usersStatus: {},
    setUserStatus: () => {},
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const value = useInitSocket();

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => useContext(SocketContext);
