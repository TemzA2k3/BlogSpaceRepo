import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "@/hooks/reduxHooks";

import { PostCard } from "@/components/PostCard";
import { TrendingTopicsCard } from "@/components/TrendingTopicsCard";
import { TopCommunitiesCard } from "@/components/TopCommunitiesCard";
import { SuggestionsCard } from "@/components/SuggestionsCard";

import { getAvatarUrl } from "@/shared/utils/getAvatarUrl";

import { type Post } from "@/shared/types/postTypes";


const mockPosts: Post[] = [
    {
        id: 1,
        firstName: "Alex",
        lastName: "Dev",
        username: "alex_dev",
        content: "Работаю над новым pet-проектом 🚀",
        hashtags: ["#devlife", "#react"],
        likes: 42,
        comments: 5,
        saved: 10,
        avatar: "https://placehold.co/70x70",
        date: "2025-10-20",
    },
    {
        id: 2,
        firstName: "Maria",
        lastName: "Sokolova",
        username: "maria",
        content: "Люблю тёмную тему ❤️",
        hashtags: ["#uiux", "#darkmode"],
        likes: 12,
        comments: 3,
        saved: 4,
        avatar: "https://placehold.co/70x70",
        date: "2025-10-21",
    },
    {
        id: 3,
        firstName: "Ivan",
        lastName: "Coder",
        username: "ivan_coder",
        content: "Пишу статью о TypeScript. Делитесь опытом!",
        hashtags: ["#typescript", "#frontend"],
        likes: 30,
        comments: 9,
        saved: 6,
        avatar: "https://placehold.co/70x70",
        date: "2025-10-22",
    },
    {
        id: 4,
        firstName: "Alex",
        lastName: "Dev",
        username: "alex_dev",
        content: "Работаю над новым pet-проектом 🚀",
        hashtags: ["#devlife", "#react"],
        likes: 42,
        comments: 5,
        saved: 10,
        avatar: "https://placehold.co/70x70",
        date: "2025-10-20",
    },
    {
        id: 5,
        firstName: "Alex",
        lastName: "Dev",
        username: "alex_dev",
        content: "Работаю над новым pet-проектом 🚀",
        hashtags: ["#devlife", "#react"],
        likes: 42,
        comments: 5,
        saved: 10,
        avatar: "https://placehold.co/70x70",
        date: "2025-10-20",
    },
    {
        id: 6,
        firstName: "Alex",
        lastName: "Dev",
        username: "alex_dev",
        content: "Работаю над новым pet-проектом 🚀",
        hashtags: ["#devlife", "#react"],
        likes: 42,
        comments: 5,
        saved: 10,
        avatar: "https://placehold.co/70x70",
        date: "2025-10-20",
    },
];


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
    const { currentUser } = useAppSelector(state => state.auth)
    const navigate = useNavigate();

    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        setPosts(mockPosts);
    }, []);

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
                        Что у вас нового?
                    </div>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-full shadow transition-colors duration-150"
                    >
                        Написать
                    </button>
                </div>
                )}
                <div className="space-y-6">
                    {posts.map(post => (
                        <PostCard
                            key={post.id}
                            avatar={post.avatar}
                            firstName={post.firstName}
                            lastName={post.lastName}
                            username={post.username}
                            content={post.content}
                            date={post.date}
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
