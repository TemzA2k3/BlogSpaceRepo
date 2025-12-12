import { useState, useEffect, useCallback } from "react";
import { useAlert } from "@/app/providers/alert/AlertProvider";

import { fetchArticleData } from "@/shared/services/fetchArticleData";
import { toggleArticleLike, toggleArticleSave } from "@/shared/services/toggleArticleActions";

import type { ArticleData } from "@/shared/types/article.types";
import type { Comment } from "@/shared/types/comment.types"

export const useArticleData = (articleId: string | undefined) => {
    const [articleData, setArticleData] = useState<ArticleData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { showAlert } = useAlert();

    const getArticleData = async (id: string) => {
        setLoading(true);
        try {
            const data = await fetchArticleData(id);
            setArticleData(data || null);
        } catch (err: any) {
            setError(err.message || "Ошибка загрузки статьи");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!articleId) return;
        getArticleData(articleId);
    }, [articleId]);

    useEffect(() => {
        if (!error) return;
        showAlert(error);
    }, [error]);

    const handleLike = useCallback(async () => {
        if (!articleData) return;

        try {
            const result = await toggleArticleLike(articleData.id);
            setArticleData(prev =>
                !prev || !result
                    ? prev
                    : { ...prev, likes: result.likes, likedByCurrentUser: result.likedByCurrentUser }
            );
        } catch (err: any) {
            showAlert(err.message || "Ошибка при лайке статьи");
        }
    }, [articleData]);

    const handleSave = useCallback(async () => {
        if (!articleData) return;

        try {
            const result = await toggleArticleSave(articleData.id);
            setArticleData(prev =>
                !prev || !result
                    ? prev
                    : { ...prev, saved: result.saved, savedByCurrentUser: result.savedByCurrentUser }
            );
        } catch (err: any) {
            showAlert(err.message || "Ошибка при сохранении статьи");
        }
    }, [articleData]);

    // Новая функция для добавления комментария и обновления счётчика
    const addCommentToArticle = useCallback((newComment: Comment) => {
        setArticleData(prev =>
            !prev
                ? prev
                : {
                      ...prev,
                      comments: [...prev.comments, newComment],
                      commentsCount: prev.commentsCount + 1,
                  }
        );
    }, []);

    return { articleData, loading, handleLike, handleSave, addCommentToArticle };
};
