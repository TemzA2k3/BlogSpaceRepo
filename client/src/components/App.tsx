import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import { ErrorFallback } from "../features/errors/ErrorFallback";

import { AlertProvider } from "@/app/providers/alert/AlertProvider"
import { ThemeProvider } from "@/app/providers/theme/ThemeProvider";
import { SocketProvider } from "@/app/providers/socket/SocketProvider";
import { router } from "@/app/providers/router/router";
import { useAppDispatch } from "@/hooks/redux/reduxHooks";
import { getMe } from "@/store/slices/authSlice";

import { useViewportHeight } from "@/hooks/layouts/useViewportHeight";

export const App = () => {
    const dispatch = useAppDispatch();
    
    useViewportHeight();

    useEffect(() => {
        dispatch(getMe())
    }, [dispatch])

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <ThemeProvider>
                <AlertProvider>
                    <SocketProvider>
                        <RouterProvider router={router} />
                    </SocketProvider>
                </AlertProvider>
            </ThemeProvider>
        </ErrorBoundary>
    )
};
