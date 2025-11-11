import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useAlert } from "@/app/providers/alert/AlertProvider";

import { PostCard } from "@/components/PostCard";
import { TrendingTopicsCard } from "@/components/TrendingTopicsCard";
import { TopCommunitiesCard } from "@/components/TopCommunitiesCard";
import { SuggestionsCard } from "@/components/SuggestionsCard";

import { getPosts } from "@/store/slices/postSlice"

import { getAvatarUrl } from "@/shared/utils/getImagesUrls";

import type { UsersPosts } from "@/shared/types/postTypes";
import { useTranslation } from "react-i18next";


const trendingTopics = [
    { tag: "#react", count: 123 },
    { tag: "#frontend", count: 89 },
    { tag: "#typescript", count: 65 },
    { tag: "#darkmode", count: 42 },
    { tag: "#devlife", count: 38 },
];

const topCommunities = [
    { id: 1, name: "React Developers", members: 2543 },
    { id: 2, name: "UI/UX Enthusiasts", members: 1876 },
    { id: 3, name: "TypeScript Nation", members: 1210 },
];

const suggestedUsers = [
    { id: 1, name: "frontend_guru" },
    { id: 2, name: "jslover" },
    { id: 3, name: "tech_writer" },
];

export const PostsPage = () => {
    const { t } = useTranslation();
    const { currentUser } = useAppSelector(state => state.auth)
    const { posts } = useAppSelector(state => state.posts)
    const { showAlert } = useAlert();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [userPosts, setUserPosts] = useState<UsersPosts[]>([]);

    useEffect(() => {
        dispatch(getPosts())
            .unwrap()
            .catch((err: any) => {
                showAlert(err.message || "Ошибка при загрузке постов", "error");
            });
    }, [dispatch, showAlert]);

    useEffect(() => {
        console.log(posts)
        setUserPosts(posts);
    }, [posts]);


    return (
        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-center gap-6 lg:gap-10 text-gray-800 dark:text-gray-100">

            {/* Левая колонка */}
            <aside className="w-full lg:w-80 xl:w-[40rem] flex flex-col gap-6 lg:flex hidden lg:flex-col">
                <TrendingTopicsCard topics={trendingTopics} />
                <TopCommunitiesCard communities={topCommunities} />
            </aside>

            {/* Центральная колонка — посты */}
            <div className="w-full max-w-3xl h-[70vh] sm:h-[75vh] md:h-[80vh] overflow-y-auto flex flex-col gap-6">
                {currentUser && (
                    <div
                        onClick={() => navigate("create-post")}
                        className="flex items-center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm px-4 py-3 cursor-pointer hover:shadow-md transition-all duration-200"
                    >
                        <div className="w-10 h-10 rounded-full flex-shrink-0">
                            <img
                                className="w-full h-full"
                                src={getAvatarUrl(currentUser.firstName, currentUser.lastName, currentUser.avatar)}
                                alt={currentUser.userName}
                            />
                        </div>
                        <div className="flex-1 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full py-2 px-4">
                            {t('posts.whatsNew')}
                        </div>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-full shadow transition-colors duration-150"
                        >
                            {t('posts.writeSmth')}
                        </button>
                    </div>
                )}
                <div className="space-y-6">
                    {userPosts.map(post => (
                        <PostCard
                            key={post.id}
                            id={post.id}
                            userId={post.userId}
                            avatar={getAvatarUrl(post.firstName, post.lastName, post.avatar)}
                            firstName={post.firstName}
                            lastName={post.lastName}
                            username={post.username}
                            content={post.content}
                            image={post.image}
                            hashtags={post.hashtags}
                            date={post.createdAt}
                            likes={post.likes}
                            comments={post.comments}
                            saved={post.saved}
                        />
                    ))}
                </div>
            </div>

            {/* Правая колонка */}
            <aside className="w-full lg:w-80 xl:w-[40rem] hidden lg:block space-y-6">
                <SuggestionsCard users={suggestedUsers} />
            </aside>
        </main>
    );
};
