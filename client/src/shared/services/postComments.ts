import { apiRequest } from "../api/apiClient";
import type { Comment } from "../types/comment.types";

export const fetchPostComments = async (
    postId: number,
    offset = 0,
    limit = 5
): Promise<Comment[]> => {
    try {
        const data = await apiRequest<Comment[]>(
            `/comments/post/${postId}?offset=${offset}&limit=${limit}`,
            "GET",
            { credentials: "include" }
        );

        return data || [];
    } catch (err: any) {
        throw new Error(err.message || "Ошибка загрузки комментариев");
    }
};

export const fetchCommentReplies = async (
    commentId: number,
    offset = 0,
    limit = 3
): Promise<Comment[]> => {
    try {
        const data = await apiRequest<Comment[]>(
            `/comments/${commentId}/replies?offset=${offset}&limit=${limit}`,
            "GET",
            { credentials: "include" }
        );

        return data || [];
    } catch (err: any) {
        throw new Error(err.message || "Ошибка загрузки ответов");
    }
};

export const createPostComment = async (
    postId: number,
    content: string,
    parentId?: number
): Promise<Comment> => {
    try {
        const body = { content, parentId };
        const data = await apiRequest<Comment>(
            `/comments/post/${postId}`,
            "POST",
            {
                body: JSON.stringify(body),
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            }
        );

        if (!data) throw new Error("Комментарий не был создан");

        return data;
    } catch (err: any) {
        throw new Error(err.message || "Ошибка добавления комментария");
    }
};
