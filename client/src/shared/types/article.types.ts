import type { HashTag } from "./hashTag.types";

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