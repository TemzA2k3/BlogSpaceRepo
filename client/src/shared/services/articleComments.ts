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

        console.log(data);
        

        return data; // возвращает созданный комментарий
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong while creating the comment");
    }
};
