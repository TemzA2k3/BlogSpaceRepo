import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux/reduxHooks";
import type { ReactNode } from "react";
import { Loader } from "@/shared/components/Loader";

interface PublicOnlyRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

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
