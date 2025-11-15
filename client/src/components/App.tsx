import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { AlertProvider } from "@/app/providers/alert/AlertProvider"
import { ThemeProvider } from "@/app/providers/theme/ThemeProvider";
import { router } from "@/app/providers/router/router";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { getMe } from "@/store/slices/authSlice";

export const App = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getMe())
    }, [dispatch])

    return (
        <>
            <ThemeProvider>
                <AlertProvider>
                    <RouterProvider router={router} />
                </AlertProvider>
            </ThemeProvider>

        </>
    )
};
