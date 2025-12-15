import type { Comment } from "../types/comment.types";

export const addReplyToTree = (
    comments: Comment[],
    parentId: number,
    replies: Comment[],
    prepend: boolean = false 
): Comment[] => {
    return comments.map(comment => {
        if (comment.id === parentId) {
            return {
                ...comment,
                replies: prepend
                    ? [...replies.map(r => ({ ...r, indent: true })), ...(comment.replies ?? [])]
                    : [...(comment.replies ?? []), ...replies.map(r => ({ ...r, indent: true }))],
            };
        }

        if (comment.replies?.length) {
            return {
                ...comment,
                replies: addReplyToTree(comment.replies, parentId, replies, prepend),
            };
        }

        return comment;
    });
};
