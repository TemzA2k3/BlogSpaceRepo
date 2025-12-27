import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux/reduxHooks";

import { Loader } from "@/shared/components/Loader";

import type { PublicOnlyRouteProps } from "@/shared/types/route.types";

export const PublicOnlyRoute = ({ children, redirectTo = "/" }: PublicOnlyRouteProps) => {
    const { currentUser, initialized } = useAppSelector((state) => state.auth);

    if (!initialized) {
        return <Loader />;
    }

    if (currentUser) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};
