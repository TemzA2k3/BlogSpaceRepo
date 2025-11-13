import type { HashTag } from "./hashTagTypes";

export interface ArticlePreview {
    id: number;
    title: string;
    author: string;
    authorId: number
    content: string;
    tags: HashTag[];
    imageUrl: string;
}

export interface ArticlesState {
    articles: ArticlePreview[];
    isLoading: boolean;
    error: string | null;
}

export interface ArticleData {
    id: number;
    title: string;
    author: string;
    authorId: number
    content: string;
    tags: HashTag[];
    imageUrl: string;
}