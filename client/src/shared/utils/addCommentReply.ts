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
                replies: [reply, ...(comment.replies ?? [])],
            };
        }

        if (comment.replies?.length) {
            return {
                replies: addReplyToTree(comment.replies, parentId, reply),
                ...comment,
            };
        }

        return comment;
    });
};
