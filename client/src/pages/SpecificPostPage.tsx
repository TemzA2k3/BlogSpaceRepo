import { useParams, useNavigate } from "react-router-dom";

import { getAvatarUrl } from "@/shared/utils/getImagesUrls";
import { Loader } from "@/shared/components/Loader";
import { PostCard } from "@/components/PostCard";
import { NotFoundPage } from "./NotFoundPage";
import { CommentsSection } from "@/components/CommentsSection";

import { usePost } from "@/hooks/posts/usePost";

export const SpecificPostPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const postId = id ? +id : undefined;

    const {
        post,
        loading,
        handlePostDelete,
        handlePostUpdate,
        comments,
        loadReplies,
        onSubmitComment,
        hasMoreComments,
        loadComments
    } = usePost(postId);

    if (loading) return <Loader />;
    if (!post) return <NotFoundPage />;

    return (
        <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex flex-col gap-6 text-gray-800 dark:text-gray-100">
            <div
                className="flex items-center gap-2 text-sm mb-6 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-500"
                onClick={() => navigate(-1)}
            >
                <span className="text-lg">←</span>
                <span>Вернуться назад</span>
            </div>

            <PostCard
                {...post}
                avatar={getAvatarUrl(post.firstName, post.lastName, post.avatar)}
                onPostUpdate={handlePostUpdate}
                onPostDelete={handlePostDelete}
            />

            <CommentsSection
                comments={comments}
                onSubmitComment={onSubmitComment}
                onLoadMoreComments={loadComments}
                hasMore={hasMoreComments}
                onLoadReplies={loadReplies}
            />
        </main>
    );
};
