import type { ReactNode } from "react";

export interface PublicOnlyRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

export interface ProtectedRouteProps {
    children: ReactNode;
    redirectTo?: string;
}