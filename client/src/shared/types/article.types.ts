import type { HashTag } from "./hashtag.types";
import type { Comment } from "./comment.types";
import type { Paggination } from "./paggination.types";

export interface ArticlePreview {
    id: number;
    title: string;
    author: string;
    authorId: number;
    description: string;
    sections: ArticleSections[];
    tags: HashTag[];
    imageUrl: string;
}

export interface ArticleSections {
    id: number;
    title: string;
    content: string;
}

export interface ArticleAuthor {
    id: number;
    userName: string;
    fullName: string;
    avatar: string | null;
}

export interface SectionsEditorProps {
    sections: ArticleSections[]
    lastFocusedTextarea: React.MutableRefObject<HTMLTextAreaElement | null>
    showEmojiPicker: boolean
    addSection: () => void
    removeSection: (id: number) => void
    updateSection: (id: number, field: "title" | "content", value: string) => void
    toggleEmojiPicker: () => void
    addEmoji: (emoji: string) => void
    handleTagClick: () => void
    tags: string[]
    removeTag: (index: number) => void
}

export interface ArticlesState extends Paggination {
    articles: ArticlePreview[];
    isLoading: boolean;
    error: string | null;
}

export interface ArticleData {
    id: number;
    title: string;
    description: string;
    sections: ArticleSections[];
    coverImage: string;
    createdAt: string;
    author: ArticleAuthor;
    hashtags: HashTag[];
    likes: number;
    commentsCount: number;
    saved: number;
    likedByCurrentUser: boolean;
    savedByCurrentUser: boolean;
    comments: Comment[];
}

export interface ToggleLikeResponse {
    likes: number;
    likedByCurrentUser: boolean;
}

export interface ToggleSaveResponse {
    saved: number;
    savedByCurrentUser: boolean;
}

export interface ArticleSectionProps {
    title?: string;
    content?: string;
}

export interface ArticlesGridProps {
    articles: ArticlePreview[];
}