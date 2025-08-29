import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "../../../layouts/MainLayout"
import { EmptyLayout } from "../../../layouts/EmptyLayout"

import { HomePage } from "../../../pages/HomePage";
import AboutPage from "../../../pages/AboutPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
    ],
  },
  // {
  //   path: "/login",
  //   element: <EmptyLayout />,
  //   children: [
  //     { path: "/login", element: <HomePage /> },
  //     { path: "/signup", element: <AboutPage /> },
  //   ],
  // },
]);
