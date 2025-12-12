export interface CommentDto {
    id: number;
    firstName: string;
    lastName: string;
    authorId: number;
    avatar: string;
    date: string;
    content: string;
    indent: boolean;
    replies?: CommentDto[];
}