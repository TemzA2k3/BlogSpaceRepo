import type { ReactNode } from "react";

export type ButtonProps = {
    children: ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "outline";
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
};