import { RouterProvider } from "react-router-dom";

import { AlertProvider } from "../app/providers/alert/AlertProvider"
import { router } from "../app/providers/router/router";

export const App = () => {
  return (
    <>
        <AlertProvider >
            <RouterProvider router={router} />
        </AlertProvider>
    </>
  )
};
