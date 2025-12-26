import type { ReactNode } from "react"

export type AlertState = {
    message: string | null;
    type: "success" | "error";
};

export type AlertContextType = {
    showAlert: (message: string, type?: "success" | "error", duration?: number) => void;
};

export type AlertProviderProps = { children: ReactNode };

export type AlertProps = {
    message: string;
    type?: "success" | "error";
    onClose: () => void;
    duration?: number;
};