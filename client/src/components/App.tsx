import { RouterProvider } from "react-router-dom";

import { router } from "../app/providers/router/router";

export const App = () => {
  return <RouterProvider router={router} />;
};
