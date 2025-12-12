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
}

export interface CommentItemProps {
    comment: Comment;
}

export interface CommentsSectionProps {
    articleId: number;
    comments: Comment[];
    onLoadMoreComments?: () => void;
    addCommentToArticle?: (comment: Comment) => void;
}

export interface CommentCreateDto {
    type: CommentType;
    id: number;
    content: string;
    parentId?: number;
}