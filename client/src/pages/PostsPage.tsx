import { useRef } from "react"; 
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/hooks/redux/reduxHooks";
import { usePosts } from "@/hooks/posts/usePosts";

import { PostCard } from "@/features/posts/PostCard";
import { TrendingTopicsCard } from "@/features/posts/TrendingTopicsCard";
import { SuggestionsCard } from "@/features/posts/SuggestionsCard";
import { CreatePostSection } from "@/features/posts/CreatePostSection";

import { Loader } from "@/shared/components/Loader";
import { BlankData } from "@/shared/components/BlankData";
import { InfiniteObserver } from "@/shared/components/InfiniteObserver";
import { getAvatarUrl } from "@/shared/utils/getImagesUrls";

import "@/app/styles/scroll.css";

export const PostsPage = () => {
    const { t } = useTranslation();
    const { userPosts, loading, hasMore, fetchNextPosts, recommendations } = usePosts();
    const { currentUser } = useAppSelector(state => state.auth);

    const scrollRef = useRef<HTMLDivElement | null>(null);

    return (
        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 lg:gap-10 text-gray-800 dark:text-gray-100">
            <aside className="w-full lg:w-80 xl:w-[40rem] hidden lg:flex flex-col gap-6">
                {recommendations.trendingTopics.length > 0 ? (
                    <TrendingTopicsCard topics={recommendations.trendingTopics} />
                ) : (
                    <BlankData
                        icon="🔥"
                        title={t('posts.trendingTopics')}
                        message={t('posts.blankHashTags')}
                        background={false}
                    />
                )}
            </aside>

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

                        <InfiniteObserver
                            root={scrollRef.current}
                            enabled={!loading && hasMore}
                            onIntersect={fetchNextPosts}
                            rootMargin="200px"
                        />
                    </div>
                )}
            </div>

            <aside className="w-full lg:w-80 xl:w-[40rem] hidden lg:block space-y-6">
            {recommendations.suggestedUsers.length > 0 ? (
                     <SuggestionsCard users={recommendations.suggestedUsers} />
                ) : (
                    <BlankData
                        icon="👥"
                        title={t('posts.suggestions')}
                        message={t('posts.blankRecommendUsers')}
                        background={false}
                    />
                )}
            </aside>
        </main>
    );
};
