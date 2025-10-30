import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { AlertProvider } from "@/app/providers/alert/AlertProvider"
import { router } from "@/app/providers/router/router";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { getMe } from "@/store/slices/authSlice";

export const App = () => {
    const dispatch = useAppDispatch();
    // const { currentUser } = useAppSelector(state => state.auth);

    useEffect(() => {
        // if(!currentUser){
            dispatch(getMe())
        // }
    }, [
        dispatch,
        // currentUser
    ])

  return (
    <>
        <AlertProvider >
            <RouterProvider router={router} />
        </AlertProvider>
    </>
  )
};
