type CommentType = "article" | "post"

export interface Comment { 
    id: number; 
    firstName: string; 
    lastName: string; 
    authorId: number 
    avatar: string;
    date: string; 
    content: string; 
    indent: boolean; 
    replies?: Comment[]; 
    repliesCount?: number;
}

export interface CommentItemProps {
    comment: Comment;
    onSubmitReply: (content: string, parentId?: number) => Promise<Comment | null>;
    onLoadReplies?: (сommentId: number) => void;
}

export interface CommentsSectionProps {
    comments: Comment[];
    onSubmitComment: (content: string, parentId?: number) => Promise<Comment | null>;
    onLoadMoreComments?: () => void;
    hasMore?: boolean;
    onLoadReplies?: (сommentId: number) => void;
}

export interface CommentCreateDto {
    type: CommentType;
    id: number;
    content: string;
    parentId?: number;
}