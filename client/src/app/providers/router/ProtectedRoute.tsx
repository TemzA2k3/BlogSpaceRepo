import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux/reduxHooks";

import { Loader } from "@/shared/components/Loader";

import type { ProtectedRouteProps } from "@/shared/types/route.types";

export const ProtectedRoute = ({ children, redirectTo = "/signin" }: ProtectedRouteProps) => {
    const { currentUser, initialized } = useAppSelector((state) => state.auth);

    if (!initialized) {
        return <Loader />;
    }

    if (!currentUser) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};

