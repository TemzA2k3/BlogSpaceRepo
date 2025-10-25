import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "@/layouts/MainLayout";
import { EmptyLayout } from "@/layouts/EmptyLayout";

import { HomePage } from "@/pages/HomePage";
import { PostsPage } from "@/pages/PostsPage";
import { ArticlesPage } from "@/components/ArticlesPage";
import { ExplorePage } from "@/components/ExplorePage";
import { AboutPage } from "@/pages/AboutPage";
import { SignInPage } from "@/pages/SignInPage";
import { SignUpPage } from "@/pages/SignUpPage";
import { ProfilePage } from "@/pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/posts", element: <PostsPage /> },
      { path: "/articles", element: <ArticlesPage /> },
      { path: "/explore", element: <ExplorePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/signin", element: <SignInPage /> },
      { path: "/signup", element: <SignUpPage /> },
      { path: "/profile/:id", element: <ProfilePage /> },
    ],
  },
  {
    element: <EmptyLayout />,
    children: [
      
    ],
  },
]);
