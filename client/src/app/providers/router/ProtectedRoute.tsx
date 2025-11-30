import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux/reduxHooks";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

export const ProtectedRoute = ({ children, redirectTo = "/signin" }: ProtectedRouteProps) => {
    const { currentUser } = useAppSelector((state) => state.auth);

    if (!currentUser) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};
