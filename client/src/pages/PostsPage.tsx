import { useRef } from "react"; 
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/hooks/redux/reduxHooks";
import { usePosts } from "@/hooks/posts/usePosts";

import { PostCard } from "@/components/PostCard";
import { TrendingTopicsCard } from "@/components/TrendingTopicsCard";
import { TopCommunitiesCard } from "@/components/TopCommunitiesCard";
import { SuggestionsCard } from "@/components/SuggestionsCard";
import { CreatePostSection } from "@/components/CreatePostSection";

import { Loader } from "@/shared/components/Loader";
import { BlankData } from "@/shared/components/BlankData";
import { InfiniteObserver } from "@/shared/components/InfiniteObserver";
import { getAvatarUrl } from "@/shared/utils/getImagesUrls";

import "@/app/styles/scroll.css";

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
    const { userPosts, loading, hasMore, fetchNextPosts } = usePosts();
    const { currentUser } = useAppSelector(state => state.auth);

    const scrollRef = useRef<HTMLDivElement | null>(null);

    return (
        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 lg:gap-10 text-gray-800 dark:text-gray-100">
            {/* Левая колонка */}
            <aside className="w-full lg:w-80 xl:w-[40rem] hidden lg:flex flex-col gap-6">
                <TrendingTopicsCard topics={trendingTopics} />
                <TopCommunitiesCard communities={topCommunities} />
            </aside>

            {/* Центр — посты */}
            <div
                ref={scrollRef} 
                className="w-full max-w-3xl h-[70vh] sm:h-[75vh] md:h-[80vh] overflow-y-auto flex flex-col gap-6 custom-scroll">
                {currentUser && (
                    <CreatePostSection
                        firstName={currentUser.firstName}
                        lastName={currentUser.lastName}
                        avatar={currentUser.avatar}
                        userName={currentUser.userName}
                    />
                )}

                {loading && userPosts.length === 0 ? (
                    <Loader />
                ) : userPosts.length === 0 ? (
                    <BlankData
                        icon="📝"
                        title={t("posts.zeroPosts")}
                        message={t("posts.zeroPostsLabel")}
                    />
                ) : (
                    <div className="space-y-6">
                        {userPosts.map(post => (
                            <PostCard
                                key={post.id}
                                {...post}
                                avatar={getAvatarUrl(
                                    post.firstName,
                                    post.lastName,
                                    post.avatar
                                )}
                            />
                        ))}

                        {/* Infinite scroll триггер */}
                        <InfiniteObserver
                            root={scrollRef.current}
                            enabled={!loading && hasMore}
                            onIntersect={fetchNextPosts}
                            rootMargin="200px"
                        />
                    </div>
                )}
            </div>

            {/* Правая колонка */}
            <aside className="w-full lg:w-80 xl:w-[40rem] hidden lg:block space-y-6">
                <SuggestionsCard users={suggestedUsers} />
            </aside>
        </main>
    );
};
