import type { ReactNode } from "react";

import { SocketContext } from "./SocketContext";
import { useInitSocket } from "@/hooks/socket/useInitSocket";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const value = useInitSocket();

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
