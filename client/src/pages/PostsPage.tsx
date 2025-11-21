import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useAlert } from "@/app/providers/alert/AlertProvider";

import { PostCard } from "@/components/PostCard";
import { TrendingTopicsCard } from "@/components/TrendingTopicsCard";
import { TopCommunitiesCard } from "@/components/TopCommunitiesCard";
import { SuggestionsCard } from "@/components/SuggestionsCard";
import { CreatePostSection } from "@/components/CreatePostSection";

import { getPosts } from "@/store/slices/postSlice"

import { getAvatarUrl } from "@/shared/utils/getImagesUrls";

import type { UsersPosts } from "@/shared/types/post.types";
import { Loader } from "@/shared/components/Loader";
import { BlankData } from "@/shared/components/BlankData";


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
    const { posts, loading, error } = useAppSelector(state => state.posts)
    const { showAlert } = useAlert();
    const dispatch = useAppDispatch();

    const [userPosts, setUserPosts] = useState<UsersPosts[]>([]);

    useEffect(() => {
        dispatch(getPosts())
            .unwrap()
            .catch((err: any) => {
                showAlert(err.message || "Ошибка при загрузке постов", "error");
            });
    }, [dispatch, showAlert]);

    useEffect(() => {
        setUserPosts(posts);
    }, [posts]);

    // useEffect(() => {
    //     if (!error) return

    //     showAlert(error, "error")
    // }, [error])

    return (
        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-center gap-6 lg:gap-10 text-gray-800 dark:text-gray-100">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <aside className="w-full lg:w-80 xl:w-[40rem] flex flex-col gap-6 lg:flex hidden lg:flex-col">
                        <TrendingTopicsCard topics={trendingTopics} />
                        <TopCommunitiesCard communities={topCommunities} />
                    </aside>

                    <div className="w-full max-w-3xl h-[70vh] sm:h-[75vh] md:h-[80vh] overflow-y-auto flex flex-col gap-6">
                        {currentUser && (
                            <CreatePostSection
                                firstName={currentUser.firstName}
                                lastName={currentUser.lastName}
                                avatar={currentUser.avatar}
                                userName={currentUser.userName}
                            />
                        )}
                        <div className="space-y-6">
                            {userPosts.length === 0 ? (
                                <BlankData
                                    icon="📝"
                                    title={t('posts.zeroPosts')}
                                    message={t('posts.zeroPostsLabel')}
                                />
                            ) : (
                                userPosts.map(post => (
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
                                ))
                            )}
                        </div>
                    </div>

                    <aside className="w-full lg:w-80 xl:w-[40rem] hidden lg:block space-y-6">
                        <SuggestionsCard users={suggestedUsers} />
                    </aside>
                </>
            )}
        </main>
    );
};
