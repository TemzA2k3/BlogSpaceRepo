import { useEffect, useState } from "react";

import { PostCard } from "@/components/PostCard";
import { TrendingTopicsCard } from "@/components/TrendingTopicsCard";
import { TopCommunitiesCard } from "@/components/TopCommunitiesCard";
import { SuggestionsCard } from "@/components/SuggestionsCard";

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
            <div className="w-full max-w-3xl h-[70vh] sm:h-[75vh] md:h-[80vh] overflow-y-auto">
                <div className="space-y-6 pr-2 sm:pr-4">
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
