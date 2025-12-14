import { useState, useEffect, useCallback } from "react";
import { useAlert } from "@/app/providers/alert/AlertProvider";

import { fetchArticleData } from "@/shared/services/fetchArticleData";
import { toggleArticleLike, toggleArticleSave } from "@/shared/services/toggleArticleActions";
import { createArticleComment } from "@/shared/services/articleComments";

import { addReplyToTree } from "@/shared/utils/addCommentReply";

import type { ArticleData } from "@/shared/types/article.types";

export const useArticleData = (articleId?: string) => {
    const [articleData, setArticleData] = useState<ArticleData | null>(null);
    const [loading, setLoading] = useState(true);

    const { showAlert } = useAlert();

    useEffect(() => {
        if (!articleId) return;

        (async () => {
            try {
                setLoading(true);
                const data = await fetchArticleData(articleId);
                setArticleData(data || null);
            } catch (err: any) {
                showAlert(err.message || "Ошибка загрузки статьи");
            } finally {
                setLoading(false);
            }
        })();
    }, [articleId]);

    const submitArticleComment = useCallback(
        async (content: string, parentId?: number) => {
            if (!articleData) return null;
    
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
                            comments: [...prev.comments, comment],
                            commentsCount: prev.commentsCount + 1,
                        };
                    }
    
                    return {
                        ...prev,
                        comments: addReplyToTree(prev.comments, parentId, {
                            ...comment,
                            indent: true,
                        }),
                        commentsCount: prev.commentsCount + 1,
                    };
                });
    
                return comment;
            } catch (err: any) {
                showAlert(err.message || "Ошибка добавления комментария");
                return null;
            }
        },
        [articleData]
    );
    

    const handleLike = useCallback(async () => {
        if (!articleData) return;

        try {
            const res = await toggleArticleLike(articleData.id);
            if (!res) return;

            setArticleData(prev =>
                prev
                    ? { ...prev, likes: res.likes, likedByCurrentUser: res.likedByCurrentUser }
                    : prev
            );
        } catch (err: any) {
            showAlert(err.message);
        }
    }, [articleData]);

    const handleSave = useCallback(async () => {
        if (!articleData) return;

        try {
            const res = await toggleArticleSave(articleData.id);
            if (!res) return;

            setArticleData(prev =>
                prev
                    ? { ...prev, saved: res.saved, savedByCurrentUser: res.savedByCurrentUser }
                    : prev
            );
        } catch (err: any) {
            showAlert(err.message);
        }
    }, [articleData]);

    return {
        articleData,
        loading,
        handleLike,
        handleSave,
        submitArticleComment,
    };
};
