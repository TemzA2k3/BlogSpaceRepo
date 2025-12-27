import { apiRequest } from "../api/apiClient";

import type { Comment } from "../types/comment.types";

export interface CommentCreateDto {
    content: string;
    parentId?: number;
}

/**
 * Создать комментарий для статьи
 * @param articleId - ID статьи
 * @param dto - данные комментария { content, parentId? }
 */
export const createArticleComment = async (articleId: number, dto: CommentCreateDto) => {
    try {
        const data = await apiRequest<Comment>(`/comments/article/${articleId}`, "POST", {
            credentials: "include",
            body: dto,
        });

        return data;
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong while creating the comment");
    }
};


export const loadArticleComments = async (
    articleId: number,
    offset: number,
    limit = 5
): Promise<Comment[]> => {
    try {
        const data = await apiRequest<Comment[]>(
            `/comments/article/${articleId}?offset=${offset}&limit=${limit}`,
            "GET",
            {
                credentials: "include",
            }
        );

        return data || [];
    } catch (err: any) {
        throw new Error(err.message || "Ошибка загрузки комментариев");
    }
};

export const loadCommentReplies = async (
    parentId: number,
    offset: number,
    limit = 3
): Promise<Comment[]> => {
    try {
        const data = await apiRequest<Comment[]>(
            `/comments/${parentId}/replies?offset=${offset}&limit=${limit}`,
            "GET",
            {
                credentials: "include",
            }
        );

        return data || [];
    } catch (err: any) {
        throw new Error(err.message || "Ошибка загрузки ответов");
    }
};