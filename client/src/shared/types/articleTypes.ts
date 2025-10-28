export interface Article {
    id: number;
    title: string;
    author: string;
    authorId: number
    content: string;
    tags: string[];
    imageUrl: string;
}