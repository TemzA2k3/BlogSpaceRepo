import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAlert } from "@/app/providers/alert/AlertProvider";
import { useAppSelector } from "../redux/reduxHooks";

import { fetchArticleData } from "@/shared/services/fetchArticleData";
import { toggleArticleLike, toggleArticleSave } from "@/shared/services/toggleArticleActions";
import { createArticleComment, loadCommentReplies } from "@/shared/services/articleComments";
import { loadArticleComments } from "@/shared/services/articleComments";

import { addReplyToTree } from "@/shared/utils/addCommentReply";

import type { ArticleData } from "@/shared/types/article.types";

export const useArticleData = (articleId?: string) => {
    const { t } = useTranslation();
    const { currentUser } = useAppSelector(state => state.auth)
    const navigate = useNavigate();

    const [articleData, setArticleData] = useState<ArticleData | null>(null);
    const [loading, setLoading] = useState(true);

    const [commentsOffset, setCommentsOffset] = useState(5);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(false);

    const { showAlert } = useAlert();

    useEffect(() => {
        if (!articleId) return;

        (async () => {
            try {
                setLoading(true);
                const data = await fetchArticleData(articleId);
                setArticleData(data || null);

                if (data) {
                    setCommentsOffset(data.comments.length);
                    setHasMoreComments(data.comments.length < data.commentsCount);
                }
            } catch (err: any) {
                showAlert(err.message || t("articles.loadError"));
            } finally {
                setLoading(false);
            }
        })();
    }, [articleId, t]);


    const submitArticleComment = useCallback(
        async (content: string, parentId?: number) => {
            if (!articleData) return null;

            if (!currentUser) {
                navigate('/signin')
    
                return null;
            }

            try {
                const comment = await createArticleComment(articleData.id, {
                    content,
                    parentId,
                });

                if (!comment) return null;

                setArticleData(prev => {
                    if (!prev) return prev;

                    if (!parentId) {
                        return {
                            ...prev,
                            comments: [comment, ...prev.comments],
                            commentsCount: prev.commentsCount + 1,
                        };
                    }

                    return {
                        ...prev,
                        comments: addReplyToTree(
                            prev.comments,
                            parentId,
                            [{ ...comment, indent: true }]
                        ),
                        commentsCount: prev.commentsCount + 1,
                    };
                });

                return comment;
            } catch (err: any) {
                showAlert(err.message || t("articles.commentError"), "error");
                return null;
            }
        },
        [articleData]
    );

    const loadComments = useCallback(async () => {
        if (!articleData || commentsLoading || !hasMoreComments) return;

        try {
            setCommentsLoading(true);

            const nextComments = await loadArticleComments(
                articleData.id,
                commentsOffset
            );

            if (nextComments.length === 0) {
                setHasMoreComments(false);
                return;
            }

            setArticleData(prev =>
                prev
                    ? {
                        ...prev,
                        comments: [...prev.comments, ...nextComments],
                    }
                    : prev
            );

            const newOffset = commentsOffset + nextComments.length;
            setCommentsOffset(newOffset);

            if (newOffset >= articleData.commentsCount) {
                setHasMoreComments(false);
            }
        } catch (e: any) {
            showAlert(e.message);
        } finally {
            setCommentsLoading(false);
        }
    }, [articleData, commentsOffset, commentsLoading, hasMoreComments]);

    const loadReplies = useCallback(
        async (parentId: number) => {
            if (!articleData) return;
    
            const parentComment = articleData.comments.find(c => c.id === parentId);
            if (!parentComment) return;
    
            const loaded = parentComment.replies?.length ?? 0;
            const total = parentComment.repliesCount ?? 0;
    
            const remaining = total - loaded;
            if (remaining <= 0) return;
    
            try {
                const replies = await loadCommentReplies(
                    parentId,
                    loaded,
                    remaining
                );
    
                if (!replies.length) return;
    
                setArticleData(prev =>
                    prev
                        ? {
                            ...prev,
                            comments: addReplyToTree(
                                prev.comments,
                                parentId,
                                replies
                            ),
                        }
                        : prev
                );
            } catch (err: any) {
                showAlert(err.message || t("articles.repliesError"), "error");
            }
        },
        [articleData]
    );
    
    const handleLike = useCallback(async () => {
        if (!articleData) return;

        if (!currentUser) {
            navigate('/signin')

            return;
        }

        try {
            const res = await toggleArticleLike(articleData.id);
            if (!res) return;

            setArticleData(prev =>
                prev
                    ? { ...prev, likes: res.likes, likedByCurrentUser: res.likedByCurrentUser }
                    : prev
            );
        } catch (err: any) {
            showAlert(err.message, "error");
        }
    }, [articleData]);

    const handleSave = useCallback(async () => {
        if (!articleData) return;

        if (!currentUser) {
            navigate('/signin')

            return;
        }

        try {
            const res = await toggleArticleSave(articleData.id);
            if (!res) return;

            setArticleData(prev =>
                prev
                    ? { ...prev, saved: res.saved, savedByCurrentUser: res.savedByCurrentUser }
                    : prev
            );
        } catch (err: any) {
            showAlert(err.message, "error");
        }
    }, [articleData]);

    return {
        articleData,
        loading,
        handleLike,
        handleSave,
        submitArticleComment,
        loadComments,
        hasMoreComments,
        loadReplies
    };
};