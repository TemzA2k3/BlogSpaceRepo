import { createBrowserRouter } from "react-router-dom";

import { App } from "../../../components/App";
import HomePage from "../../../pages/HomePage";
import AboutPage from "../../../pages/AboutPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
    ],
  },
]);
