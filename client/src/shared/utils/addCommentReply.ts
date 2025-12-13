import type { Comment } from "../types/comment.types";

export const addReplyToTree = (
    comments: Comment[],
    parentId: number,
    reply: Comment
): Comment[] => {
    return comments.map(comment => {
        if (comment.id === parentId) {
            return {
                ...comment,
                replies: [...(comment.replies ?? []), reply],
            };
        }

        if (comment.replies?.length) {
            return {
                ...comment,
                replies: addReplyToTree(comment.replies, parentId, reply),
            };
        }

        return comment;
    });
};
