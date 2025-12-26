import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";

import { MainLayout } from "@/layouts/MainLayout";
import { HeaderLayout } from "@/layouts/HeaderLayout";
import { EmptyLayout } from "@/layouts/EmptyLayout";

import { HomePage } from "@/pages/HomePage";
import { ContactPage } from "@/pages/ContactPage";
import { PostsPage } from "@/pages/PostsPage";
import { SpecificPostPage } from "@/pages/SpecificPostPage";
import { CreatePostPage } from "@/pages/CreatePostPage";
import { ArticlesPage } from "@/pages/ArticlesPage";
import { CreateArticlePage } from "@/pages/CteateArticlePage";
import { ExplorePage } from "@/pages/ExplorePage";
import { AboutPage } from "@/pages/AboutPage";
import { SignInPage } from "@/pages/SignInPage";
import { SignUpPage } from "@/pages/SignUpPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage"
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { SettingsPage } from "@/pages/SettingsPage";
import { UserFollowingPage } from "@/pages/UserFollowingPage";
import { UserFollowersPage } from "@/pages/UserFollowersPage";
import { SpecificArticlePage } from "@/pages/SpecificArticlePage";
import { MessagesPage } from "@/pages/MessagesPage";

import { ErrorFallback } from "@/components/ErrorFallback";

import { NotFoundPage } from "@/pages/NotFoundPage";

const withErrorElement = (element: React.ReactNode) => ({
    element,
    errorElement: <ErrorFallback />
});

export const router = createBrowserRouter([
    {
        path: "/",
        ...withErrorElement(<MainLayout />),
        children: [
            { path: "/", ...withErrorElement(<HomePage />) },

            { path: "/posts", ...withErrorElement(<PostsPage />) },
            { path: "/posts/:id", ...withErrorElement(<SpecificPostPage />) },
            {
                path: "/posts/create",
                ...withErrorElement(
                    <ProtectedRoute>
                        <CreatePostPage />
                    </ProtectedRoute>
                ),
            },

            { path: "/articles", ...withErrorElement(<ArticlesPage />) },
            {
                path: "/articles/create",
                ...withErrorElement(
                    <ProtectedRoute>
                        <CreateArticlePage />
                    </ProtectedRoute>
                ),
            },
            { path: "/articles/:id", ...withErrorElement(<SpecificArticlePage />) },

            { path: "/explore", ...withErrorElement(<ExplorePage />) },

            { path: "/about", ...withErrorElement(<AboutPage />) },

            { path: "/contact", ...withErrorElement(<ContactPage />) },

            { path: "/signin", ...withErrorElement(<SignInPage />) },
            { path: "/signup", ...withErrorElement(<SignUpPage />) },
            {
                path: "/forgot-password", ...withErrorElement(
                    <PublicOnlyRoute>
                        <ForgotPasswordPage />
                    </PublicOnlyRoute>
                )
            },
            { path: "/reset-password", ...withErrorElement(<ResetPasswordPage />) },

            { path: "/users/:id", ...withErrorElement(<ProfilePage />) },
            {
                path: "/users/:id/settings", ...withErrorElement(
                    <ProtectedRoute>
                        <SettingsPage />
                    </ProtectedRoute>
                )
            },
            { path: "/users/:id/following", ...withErrorElement(<UserFollowingPage />) },
            { path: "/users/:id/followers", ...withErrorElement(<UserFollowersPage />) },
        ],
    },
    {
        ...withErrorElement(<HeaderLayout />),
        children: [
            {
                path: "/messages",
                ...withErrorElement(
                    <ProtectedRoute>
                        <MessagesPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        ...withErrorElement(<EmptyLayout />),
        children: [
            { path: "*", ...withErrorElement(<NotFoundPage />) },
        ],
    },
]);
