import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useAlert } from "@/app/providers/alert/AlertProvider";

import { fetchPostById } from "@/shared/services/fetchPostDataById";
import { fetchPostComments, fetchCommentReplies, createPostComment } from "@/shared/services/postComments";
import { addReplyToTree } from "@/shared/utils/addCommentReply";

import type { SpecificUserPost } from "@/shared/types/post.types";
import type { Comment } from "@/shared/types/comment.types";

export const usePost = (postId?: number) => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [post, setPost] = useState<SpecificUserPost | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const [commentsOffset, setCommentsOffset] = useState(0);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(false);

    const limit = 5; // корневые комментарии за один запрос

    useEffect(() => {
        if (!postId) return;

        (async () => {
            try {
                setLoading(true);

                const [postData, initialComments] = await Promise.all([
                    fetchPostById(postId),
                    fetchPostComments(postId, 0, limit),
                ]);

                setPost(postData);
                setComments(initialComments);
                setCommentsOffset(initialComments.length);

                setHasMoreComments((postData?.comments ?? 0) > initialComments.length);

            } catch (err: any) {
                showAlert(err.message || "Ошибка загрузки данных");
            } finally {
                setLoading(false);
            }
        })();
    }, [postId]);

    const loadComments = useCallback(async () => {
        if (!postId || !post || !hasMoreComments || commentsLoading) return;

        try {
            setCommentsLoading(true);

            const nextComments = await fetchPostComments(postId, commentsOffset, limit);

            setComments(prev => [...prev, ...nextComments]);
            const newOffset = commentsOffset + nextComments.length;
            setCommentsOffset(newOffset);

            setHasMoreComments((post.comments ?? 0) > newOffset);

        } catch (err: any) {
            showAlert(err.message || "Ошибка загрузки комментариев");
        } finally {
            setCommentsLoading(false);
        }
    }, [postId, post, commentsOffset, hasMoreComments, commentsLoading]);

    const loadReplies = useCallback(async (parentId: number) => {
        const parentComment = comments.find(c => c.id === parentId);
        if (!parentComment) return;

        const loadedReplies = parentComment.replies?.length ?? 0;
        const remaining = (parentComment.repliesCount ?? 0) - loadedReplies;
        if (remaining <= 0) return;

        try {
            const replies = await fetchCommentReplies(parentId, loadedReplies, remaining);

            if (replies.length) {
                setComments(prev =>
                    addReplyToTree(prev, parentId, replies)
                );
            }
        } catch (err: any) {
            showAlert(err.message || "Ошибка загрузки ответов");
        }
    }, [comments]);

    const onSubmitComment = useCallback(
        async (content: string, parentId?: number): Promise<Comment | null> => {
            if (!postId) return null;

            try {
                const newComment = await createPostComment(postId, content, parentId);
                if (!newComment) return null;

                if (parentId) {
                    setComments(prev => addReplyToTree(prev, parentId, [newComment], true));
                } else {
                    setComments(prev => [newComment, ...prev]);
                    setCommentsOffset(prev => prev + 1);
                }

                return newComment;
            } catch (err: any) {
                showAlert(err.message || "Ошибка добавления комментария");
                return null;
            }
        },
        [postId]
    );


    const handlePostUpdate = useCallback((updatedPost: SpecificUserPost | null) => {
        if (!updatedPost) return;
        setPost(updatedPost);
    }, [commentsOffset]);

    const handlePostDelete = useCallback((deletedPostId: number) => {
        if (post?.id === deletedPostId) {
            setPost(null);
            navigate('/posts');
        }
    }, [post, navigate]);

    return {
        post,
        loading,
        comments,
        hasMoreComments,
        loadComments,
        loadReplies,
        onSubmitComment,
        handlePostUpdate,
        handlePostDelete,
    };
};
