import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "@/layouts/MainLayout";
import { EmptyLayout } from "@/layouts/EmptyLayout";

import { HomePage } from "@/pages/HomePage";
import { PostsPage } from "@/pages/PostsPage";
import { CreatePostPage } from "@/pages/CreatePostPage";
import { ArticlesPage } from "@/pages/ArticlesPage";
import { CreateArticlePage } from "@/pages/CteateArticlePage";
import { ExplorePage } from "@/pages/ExplorePage";
import { AboutPage } from "@/pages/AboutPage";
import { SignInPage } from "@/pages/SignInPage";
import { SignUpPage } from "@/pages/SignUpPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { UserFollowingPage } from "@/pages/UserFollowingPage";
import { UserFollowersPage } from "@/pages/UserFollowersPage"
import { SpecificArticlePage } from "@/pages/SpecificArticlePage";

import { NotFoundPage } from "@/pages/NotFoundPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },

      { path: "/posts", element: <PostsPage /> },
      { path: "/posts/create-post", element: <CreatePostPage /> },

      { path: "/articles", element: <ArticlesPage /> },
      { path: "/articles/create-article", element: <CreateArticlePage /> },
      { path: "/articles/:id", element: <SpecificArticlePage /> },

      { path: "/explore", element: <ExplorePage /> },

      { path: "/about", element: <AboutPage /> },

      { path: "/signin", element: <SignInPage /> },
      { path: "/signup", element: <SignUpPage /> },
      
      { path: "/users/:id", element: <ProfilePage /> },
      { path: "/users/:id/following", element: <UserFollowingPage /> },
      { path: "/users/:id/followers", element: <UserFollowersPage /> },
    ],
  },
  {
    element: <EmptyLayout />,
    children: [
        { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
