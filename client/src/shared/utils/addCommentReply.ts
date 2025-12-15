import type { Comment } from "../types/comment.types";

export const addReplyToTree = (
    comments: Comment[],
    parentId: number,
    replies: Comment[]
): Comment[] => {
    return comments.map(comment => {
        if (comment.id === parentId) {
            return {
                ...comment,
                replies: [
                    ...(comment.replies ?? []),
                    ...replies.map(r => ({ ...r, indent: true })),
                ],
            };
        }

        if (comment.replies?.length) {
            return {
                ...comment,
                replies: addReplyToTree(comment.replies, parentId, replies),
            };
        }

        return comment;
    });
};
